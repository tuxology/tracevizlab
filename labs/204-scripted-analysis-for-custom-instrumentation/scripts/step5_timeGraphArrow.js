/* The MIT License (MIT)
 *
 * Copyright (C) 2019 - Geneviève Bastien <gbastien@versatic.net>
 * Copyright (C) 2019 - École Polytechnique de Montréal
 */

// Load the proper modules
loadModule("/TraceCompass/Trace")
loadModule("/TraceCompass/Analysis")
loadModule("/TraceCompass/DataProvider")
loadModule("/TraceCompass/View")
loadModule('/TraceCompass/Utils');

// Get the active trace
var trace = getActiveTrace()

// Get an event iterator on that trace
var iter = getEventIterator(trace)
// Associate a TID with an mpi worker
var tidToWorkerMap = {};

//Get an analysis
var analysis = createScriptedAnalysis(trace, "ringTimeLine.js")
// Get the analysis's state system so we can fill it, false indicates to create a new state system even if one already exists
var ss = analysis.getStateSystem(false);

//Save information on the pending arrows
var pendingArrows = {};
//Variable to save the arrow information
var arrows = [];

// Iterate through the events
var event = null
while (iter.hasNext()) {
	event = iter.next()

	eventName = event.getName()
	if (eventName == "ring:init") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = getEventFieldValue(event, "worker_id")
		tidToWorkerMap[tid] = worker_id
	} else if (eventName == "ring:recv_entry") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		// Save the state of the resource as waiting for reception
		quark = ss.getQuarkAbsoluteAndAdd(worker_id);
		ss.modifyAttribute(event.getTimestamp().toNanos(), "Waiting for reception", quark);
	} else if (eventName == "ring:recv_exit") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		source = getEventFieldValue(event, "source")
		// Remove the waiting for reception state
		quark = ss.getQuarkAbsoluteAndAdd(worker_id);
		ss.removeAttribute(event.getTimestamp().toNanos(), quark);
		// Complete an arrow if the start was available
		pending = pendingArrows[worker_id];
		if (pending != null) {
			// There is a pending arrow (ie send) for this message
			pendingArrows[worker_id] = null;
			pending["endTime"] = event.getTimestamp().toNanos();
			arrows.push(pending);
		}

	} else if (eventName == "ring:send_entry") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		dest = getEventFieldValue(event, "dest")
		// Save the state of the resource as sending
		quark = ss.getQuarkAbsoluteAndAdd(worker_id);
		ss.modifyAttribute(event.getTimestamp().toNanos(), "Sending", quark);

		// Save a pending arrow
		pendingArrows[dest] = {"time" : event.getTimestamp().toNanos(), "source" : worker_id, "dest" : dest};
	} else if (eventName == "ring:send_exit") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		// Remove the sending for reception state
		quark = ss.getQuarkAbsoluteAndAdd(worker_id);
		ss.removeAttribute(event.getTimestamp().toNanos(), quark);
	}
}

// Done parsing the events, close the state system at the time of the last event
if (event != null) {
	ss.closeHistory(event.getTimestamp().toNanos());
}

// Get list wrappers from Trace Compass for the entries and arrows.
var tgEntries = createListWrapper();
var tgArrows = createListWrapper();

// Map the worker ID to an entry ID
var mpiWorkerToId = {};

// FIX 1 : ss.getQuarks("*") cause une ambiguïté de signature avec Rhino
// → on reconstruit la liste des workers depuis tidToWorkerMap
var workerIds = [];
for (var tid in tidToWorkerMap) {
	var wid = "" + tidToWorkerMap[tid];
	var alreadyIn = false;
	for (var k = 0; k < workerIds.length; k++) {
		if (workerIds[k] === wid) { alreadyIn = true; break; }
	}
	if (!alreadyIn) { workerIds.push(wid); }
}

// Prepare the entries
var mpiEntries = [];
for (var i = 0; i < workerIds.length; i++) {
	var wid = workerIds[i];
	var quark = ss.getQuarkAbsoluteAndAdd(wid);
	var entry = createEntry(wid, {'quark' : quark});
	mpiWorkerToId[wid] = entry.getId();
	mpiEntries.push(entry);
}

// Sort the entries numerically
mpiEntries.sort(function(a,b){return Number(a.getName()) - Number(b.getName())});
// Add the entries to the entry list
for (var i = 0; i < mpiEntries.length; i++) {
	tgEntries.getList().add(mpiEntries[i]);
}

// Prepare the arrows
for (var i = 0; i < arrows.length; i++) {
	var arrow = arrows[i];
	var srcId = mpiWorkerToId["" + arrow["source"]];
	var dstId = mpiWorkerToId["" + arrow["dest"]];
	var startTime = arrow["time"];
	var duration = arrow["endTime"] - startTime;
	if (srcId != null && dstId != null) {
		tgArrows.getList().add(createArrow(srcId, dstId, startTime, duration, 1));
	}
}

// FIX 2 : Rhino ne convertit pas automatiquement les fonctions JS en
// java.util.function.Function → utiliser JavaAdapter
var entriesList = tgEntries.getList();
var arrowsList  = tgArrows.getList();

var getEntriesFunction = new JavaAdapter(java.util.function.Function, {
	apply: function(parameters) {
		return entriesList;
	}
});

var getArrowsFunction = new JavaAdapter(java.util.function.Function, {
	apply: function(parameters) {
		return arrowsList;
	}
});

// Create a scripted data provider for this analysis
provider = createScriptedTimeGraphProvider(analysis, getEntriesFunction, null, getArrowsFunction);
if (provider != null) {
	// Open a time graph view displaying this provider
	openTimeGraphView(provider);
}
