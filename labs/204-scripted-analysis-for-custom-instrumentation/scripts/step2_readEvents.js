/* The MIT License (MIT)
 *
 * Copyright (C) 2019 - Geneviève Bastien <gbastien@versatic.net>
 * Copyright (C) 2019 - École Polytechnique de Montréal
 */

// Load the proper modules
loadModule("/TraceCompass/Trace")

// Get the active trace
var trace = getActiveTrace()

// Get an event iterator on that trace
var iter = getEventIterator(trace)
// Associate a TID with an mpi worker
var tidToWorkerMap = {};

// Iterate through the events
var event = null
while (iter.hasNext()) {
	event = iter.next()

	eventName = event.getName()
	if (eventName == "ring:init") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = getEventFieldValue(event, "worker_id")
		tidToWorkerMap[tid] = worker_id
		print("Init -> tid: " + tid + ", worker_id: " + worker_id)
	} else if (eventName == "ring:recv_entry") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		print("Entering Reception -> tid: " + tid+ ", worker_id: " + worker_id)
	} else if (eventName == "ring:recv_exit") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		source = getEventFieldValue(event, "source")
		print("Exiting Reception -> tid: " + tid + ", worker_id: " + worker_id + ", source: " + source)
	} else if (eventName == "ring:send_entry") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		dest = getEventFieldValue(event, "dest")
		print("Entering Send -> tid: " + tid + ", worker_id: " + worker_id + ", dest: " + dest)
	} else if (eventName == "ring:send_exit") {
		tid = getEventFieldValue(event, "context._vtid")
		worker_id = tidToWorkerMap[tid]
		print("Exiting Send -> tid: " + tid + ", worker_id: " + worker_id)
	}
}
