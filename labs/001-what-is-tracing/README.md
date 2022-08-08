## What/When/Why Tracing

Before going further in this tutorial and starting with the labs, let's define tracing: what it is, when to use it and how it compares with other tools.

- - -

### What Is Tracing?

`Tracing` consists in recording specific information during a program's or operating system's execution to better understand what is happening on the system. The simplest form of tracing is what we all learn in programming 101: printf!

Every location in the code that we want to trace is called a `tracepoint` and every time a tracepoint is hit is called an `event`. Putting tracepoints in the code is called `instrumentation`. The following example shows those concepts

```
int my_func(void* my_value) {
  int i, ret;

  printf("Entering my function")                 // <-- tracepoint
  for (i = 0; i < MAX; i++) {
    ret = do_something_with(my_value, i);
    printf("In for loop %d", i);                 // <-- tracepoint
  }
  printf("Done: %d", ret);                       // <-- tracepoint

  return ret;
}
```

```
$ ./myprog
Entering my function                   // <-- event
In for loop 0                          // <-- event
In for loop 1                          // <-- event
In for loop 2                          // <-- event
Done: 10                               // <-- event
```

But printf is usually used for quick instantaneous debugging of an application and is removed from production code (right?)

Logging is another form of tracing. It usually associates a timestamp with events to better understand the timing in the application. But we usually log only high level information, as disk space is a limited resource (right?)

The `tracing` we're discussing here is high speed, low overhead tracing. With such tracing, the tracepoints can be present in the code at all time (linux has tons of tracepoints in its code, ready to be hooked to), they have a near-zero overhead when not tracing and a very low overhead with a tracer enabled. Tracers can handle hundreds of thousands events/second. Some tracers, like ftrace, lttng and perf store the events on disk for later processing, others, like ebpf, handle them on the fly in callbacks that can aggregate data to gather statistics or can immediatly react to any anomaly.

- - -

### When To Trace?

Tracing is just another tool in the developer or sysadmin's toolbox. It is most often not the first one to use. But in some situations, in can be very useful, regardless of if the application to trace is instrumented or not (see next section).

Tracing is best used to understand very complex systems, or even simple ones, but the real added value comes when trying to understand complexity and all else fails.

First, let's see what else is in the toolbox and when to best use each of those tools.

* If you want to know what could/should be optimized in your application, where it spends more time, etc, then `profiling` or `sampling` is the best tool for the job. It will aggregate data of the different calls and show statistical results. The longer you profile, the more accurate the results will be. Some profilers also provide an `instrumented` mode, which is really close to tracing. By default, it aggregates the data like sampled profiling, only more accurately, but if it's possible to store the events, it could make a good userspace trace.

* If you want to debug your very complex algorithm, then a good `debugger` is the best approach, or even printfs!

* If you want to know what happened at 8h06PM on your server farm when there was that big DDOS attack, then `log` files are the best first goto. The answer is probably there.

* If you want to get performance metrics on your system through time, then `monitoring` is mandatory. Some highly detailed monitoring tools use `instrumentation`, the same as for tracing, to compute some metrics. But monitoring is mostly aggregation of data to throw alerts and show in nice graphs and dashboards.

When these tools fails though, `tracing` is there:

* When `profiling` will miss that call at around 17min in the execution where there was a huge latency, it will either go unnoticed, or be lost as a statistic, without context or detail. `Tracing` can detect that latency and you can then zoom in on it and see everything that happened around that time and led to that moment.

* When `debugging` your algorithm, or even printing the details, the bug never happens. The added latency of those techniques makes that race condition impossible to catch! Or that unit test that fails one in a 100 times. Or that service that timeouts whenever you start debugging. `Tracing`'s overhead is rarely high enough to remove the potential race condition or have the system time out, so if running with tracing enabled, when the problem happens, the trace may show what happened on the system at the time, or you may need to enable more events, but it will eventually show something.

* When `log` files have put you on a trail, but looking at everything, you just can't put your finger on it. `Tracing` will show everything (well, almost) that is hidden from log data and you can have an overview of the whole system at a given time.

* When `monitoring` shows a problematic period and querying the `logs` at that time shows the guilty component (or not), `tracing` will allow to drill down into that component or system at that time to help pinpoint the problem more accurately.

- - -

### What To Trace? Application Vs System Vs Distributed Tracing

So, what do we trace? Typically, applications have log statements in various locations, associated with a log level. Statements with high verbosity can be considered tracing statements. Log verbosity can be modified, either at system start or at runtime. Sometimes, various log handlers can be hooked to the application, per verbosity level. While file handlers are very current, other type of logging can be done. Sometimes, it can be defined at compile-time, `qemu` for instance, can compile some statements with various backends: `systemtap`, `LTTng UST`, `simple` or `stderr`.

This is what we call `application tracing` as it gives information on the internal state of the application: what happens in user land.

Sounds easy and wonderful, but how many applications have tracepoints? Not that many, though more and more, but that doesn't matter [too much].

Because there is also `system tracing`. Operating systems and drivers themselves have [a lot!] of tracepoints in their code, and that alone, gives a lot of information about an application, and mostly, about the system on which it's executing. So even without any user space data, a trace of the OS can be enough to identify many typical application problems.

`Application tracing` and `system tracing` together are very powerful. The former will allow to seize the problem, find it in time, and get the application context, like the picture of a group in front of the green screen. The latter will put this picture in its environment, ie draw the background of that group picture.

In this tutorial, we will focus only on linux, but Windows also has its tracing framework, called [ETW](https://docs.microsoft.com/en-us/windows/desktop/etw/about-event-tracing).

Nowadays, applications are developed as micro-services running in containers that can be run on various machines, either physical or virtual. Micro-services communicate together through some message passing libraries or home-made communication. `Distributed tracing` allows to follow requests through the systems. APIs like [`OpenTracing API`](https://opentracing.io/) provide a means to instrument the various components of the system and many common communication libraries are already instrumented. They only require a tracer to enable collecting data.

- - -

### How To Trace?

The rest of this tutorial will answer that question and more!

- - -

#### Next

* [Install LTTng on Ubuntu](../002-install-lttng-on-ubuntu) to install `LTTng` as a tracing tools (for application and systems) and record traces
or
* [Record System Trace With LTTng](../003-record-kernel-trace-lttng) to record system traces with `lttng`, if it is already installed.
or
* [Record System Trace With Ftrace](../004-record-kernel-trace-ftrace) to record system traces with `ftrace`
or
* [Record System Trace With Perf](../005-record-kernel-trace-perf) to record system traces with `perf`
or
* [Installing Trace Compass](../006-installing-tracecompass) to install the visualization tool and use the traces provided with the tutorial
or
* [Back](../) for more options
