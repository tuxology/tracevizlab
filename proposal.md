# Trace Visualization Lab - Part I

**Organizers:**
  * Suchakrapani Sharma
  * Geneviève Bastien
  * Hani Nemati
  * Mohamad Gebai

Trace Visualization Lab is a two part lab session that would introduce the participants to system tracing and trace
visualizations that is an invaluable technique to understand in-depth system behavior and reach root-cause of problems
faster than just CLI tracing modes. The focus of this lab is on post-mortem analysis (the system failed and we want to
understand the root cause). The tutorial first introduces attendees to system tracing, trace collection, 
storage/aggregation/filtering and eventually visualization techniques such as flamecharts, flamegraphs, timeline views, 
critical flow view (inter-process flow), container and VM views, resource usage etc). The introductory sessions also
explain why and when is systems tracing required and its role in supporting related performance anlaysis techniques such 
as distributed tracing, profiling, debugging and service log analysis. For this lab, primary trace collection will be 
through LTTng (https://lttng.org/), Perf/Ftrace and primary trace visualization system will be Trace Compass 
(http://tracecompass.org) 

## Session 1: Trace Collection
**Duration:** 45 min  
**Summary:** This session covers introduction to tracing, collection and storage of system traces from a host machine 
running a sample containerized application showing performance issues

### Topics Covered
  * Why and when do you need system tracing?
  * LTTng, `perf` and Ftrace installation/setup on local/cloud machines
  * Provide pre-baked cloud installs for attendees
  * Trace collection
	  * Selecting relevant tracepoints (syscalls, kernel functions)
	  * Setting filters, trace sources etc
  
## Session 2: Trace Visualization
**Duration:** 45 min  
**Summary:** This session first introduces visualizations used in system tracing, the common techniques and practices 
to pick and cycle through visualization and introduces **Trace Compass** as a tool for viewing traces 

### Topics Covered
  * Introducing visual performance debugging techniques and visuals tools available
	  * Timeline Views (a.k.a Gantt/Span views)
	  * Critical Flow Views
	  * Line Charts/Histograms
	  * Flamegraphs/Flamecharts
  * Introducing Trace Compass
	  * Basic usage/loading trace experiments (LTTng, perf, Ftrace, PCAP as trace sources)
	  * Anatomy of an abnormal web-request latency (ruby image processing web-app example)
	  * Understanding disk I/O latency
	  * Histograms - events, syscall latency
      * Critical path analysis (inter-process flow on a timeline)

# Trace Visualization Lab - Part II
**Duration:** 60 hrs  
**Summary:** This session introduces advanced usage of Trace Compass such a VM and container visualizations, building 
your own custom views and trace parser and inter-process control flows. 

### Topics Covered
  * IRQ analysis - network interrupts example exercise
  * Container and VM views - analysis of containerized and virtualized workloads
  * Creating custom views and trace parsers (maybe hardware trace example)
  * Bug-hunting

## References
  * Sample Traces
  * LTTng Docs: https://lttng.org/docs
  * Trace Compass: http://tracecompass.org 

