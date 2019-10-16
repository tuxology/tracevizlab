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

// Done parsing the events, close the state system at the time of the last event, it needs to be done manually otherwise the state system will still be waiting for values and will not be considered finished building
if (event != null) {
	ss.closeHistory(event.getTimestamp().toNanos());
}

// Get list wrappers from Trace Compass for the entries and arrows. The conversion between javascript list and java list is not direct, so we need a wrapper
var tgEntries = createListWrapper();
var tgArrows = createListWrapper();

/* Prepare the time graph data, there is few enough entries and arrows that it can be done once and returned once */

// Map the worker ID to an entry ID
var mpiWorkerToId = {};

// Get all the quarks of the entries
quarks = ss.getQuarks("*");
// Prepare the entries
var mpiEntries = [];
for (i = 0; i < quarks.size(); i++) {
	quark = quarks.get(i);
	// Get the mpi worker ID, and find its quark
	mpiWorkerId = ss.getAttributeName(quark);
	// Create an entry with the worker ID as name and the quark. The quark will be used to populate the entry's data.
	entry = createEntry(mpiWorkerId, {'quark' : quark});
	mpiWorkerToId[mpiWorkerId] = entry.getId();
	mpiEntries.push(entry);
}
// Sort the entries numerically
mpiEntries.sort(function(a,b){return Number(a.getName()) - Number(b.getName())});
// Add the entries to the entry list
for (i = 0; i < mpiEntries.length; i++) {
	tgEntries.getList().add(mpiEntries[i]);
}

// Prepare the arrows
for (i=0; i < arrows.length; i++) {
	arrow = arrows[i];

	// For each arrow, we get the source and destination entry ID from its mpi worker ID
	srcId = mpiWorkerToId[arrow["source"]];
	dstId = mpiWorkerToId[arrow["dest"]];
	// Get the start time and calculate the duration
	startTime = arrow["time"];
	duration = arrow["endTime"] - startTime;
	// Add the arrow to the arrows list
	tgArrows.getList().add(createArrow(srcId, dstId, startTime, duration, 1));
}

// A function used to return the entries to the data provider. It receives the filter in parameter, which contains the requested time range and any additional information
function getEntries(parameters) {
	// The list is static once built, return all entries
	return tgEntries.getList();
}

// A function used to return the arrows to the data provider. It receives the filter in parameter, which contains the requested time range and any additional information
function getArrows(parameters) {
	// Just return all the arrows, the view will take those in the range
	return tgArrows.getList();
}

// Create a scripted data provider for this analysis, using script functions to get the entries, row model data and arrows. Since the entries have a quark associated with them which contains the data to display, there is no need for a scripted getRowData function, so we send null
provider = createScriptedTimeGraphProvider(analysis, getEntries, null, getArrows);
if (provider != null) {
	// Open a time graph view displaying this provider
	openTimeGraphView(provider);
}
