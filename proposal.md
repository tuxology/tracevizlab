# Trace Viz Lab

**Organizers:**
  * Suchakrapani Sharma
  * Geneviève Bastien
  * Hani Nemati
  * Mohamad Gebai

Trace Visualization Lab is a day long session that would introduce the participants to system tracing and trace visualizations that can be used to understand in-depth system behavior and reach root-cause of problems faster than just CLI tracing modes. The focus of this lab is on post-mortem analysis (the system failed and we want to understand the root cause). The tutorial introduces attendees to system tracing, trace collection, storage/aggregation/filtering and eventually visualization techniques such as flamecharts, flamegraphs, timeline views, critical flow view (inter-process flow), container and VM views, resource usage etc). Primary trace collection will be LTTng (https://lttng.org/) and primary trace visualization system will be Trace Compass (http://tracecompass.org) 

## Session 1: Trace Collection
**Duration:** 1-2 hrs  
**Summary:** This session covers introduction to tracing, collection and storage of system traces from a host machine running a sample containerized application showing performance issues

### Topics Covered
  * Why and when do you need system tracing?
  *  LTTng Installation on local and cloud machines
  * Provide pre-baked cloud installs for attendees
  * Trace collection
	  * Selecting relevant tracepoints (syscalls, kernel functions)
	  * Setting filters, trace sources etc
  
## Session 2: Trace Visualization
**Duration:** 2-3 hrs  
**Summary:** This session first introduces visualizations used in system tracing, the common techniques and practices to pick and cycle through visualization and introduces **Trace Compass** as a tool for viewing traces 

### Topics Covered
  * Introducing visual performance debugging techniques and visuals tools available
	  * Timeline Views (a.k.a Gantt/Span views)
	  * Line Charts/Histograms
	  * Flamegraphs/Flamecharts
  * Introducing Trace Compass
	  * Basic usage/loading trace experiments
	  * Anatomy of an abnormal web-request latency (ruby image processing web-app example)
	  * Understanding disk I/O latency
	  * Histograms - events, syscall latency
  
## Session 3: Advanced Usage
**Duration:** 1-2 hrs  
**Summary:** This session introduces advanced usage of Trace Compass such a VM and container visualizations, building your own custom views and trace parser and inter-process control flows. 

### Topics Covered
  * Critical Flow views
  * Container and VM views
  * Creating custom views and trace parsers (maybe hardware trace example)

## References
  * Sample Traces
  * LTTng Docs: https://lttng.org/docs
  * Trace Compass: http://tracecompass.org 

