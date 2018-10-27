## Instructions

This directory contains the labs that are part of this tutorial. The labs are organized into caregories and can be identified by their prefix code as follows:

| Prefix Code | Lab Summary |
| --- | --- |
| **0xx** | Environment preparation and simple kernel trace collection |
| **1xx** | Kernel trace analysis (system tracing) |
| **2xx** | Simple userspace use cases (application tracing) [along with kernel] |
| **3xx** | Advanced use cases (multi-machine and distributed traces) |

## Expected Lab Flow

Each lab contains instructions on how to obtain a trace, so if you have the infrastructure available, you can get a trace yourself for the lab. But we also provide an [archive](TraceCompassTutorialTraces.tgz) with demo traces for all the labs, so you can import it in Trace Compass at the beginning and open them when necessary.


* [001 what-is-tracing](001-what-is-tracing)
* `optional` [002 install-lttng-on-ubuntu](002-install-lttng-on-ubuntu)
* `optional` [003 record-kernel-trace-lttng](003-record-kernel-trace-lttng)
* `optional` [004 record-kernel-trace-ftrace](004-record-kernel-trace-ftrace)
* `optional` [005 record-kernel-trace-perf](005-record-kernel-trace-perf)
* [006 installing-tracecompass](006-installing-tracecompass)
* [101 trace-navigation-in-tracecompass](101-trace-navigation-in-tracecompass)
* [102 tracing-wget-critical-path](102-tracing-wget-critical-path)
* [103 compare-package-managers](103-compare-package-managers)
* [201 lttng-userspace-tracing](201-lttng-userspace-tracing)
* [202 bug-hunt](202-bug-hunt)
* `optional` [203 intro to language specific tracing](203-intro-to-language-specific-tracing)
* `optional` [204 python-tracing](204-python-tracing)
* `optional` [205 tracing-php-userspace](205-tracing-php-userspace)
* [301 tracing-multiple-machines](301-tracing-multiple-machines)
* [302 system-tracing-containers](302-system-tracing-containers)
