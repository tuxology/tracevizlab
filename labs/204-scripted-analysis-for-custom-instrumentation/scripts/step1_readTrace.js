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

// Iterate through the events
var event = null
while (iter.hasNext()) {
	event = iter.next()

	// For each event, print the name and the field names
	eventString = event.getName() + " --> ( "

	var fieldsIterator = event.getContent().getFieldNames().iterator()
	while (fieldsIterator.hasNext()) {
		eventString += fieldsIterator.next() + " "
	}
	eventString += ")"

	print(eventString);
}
