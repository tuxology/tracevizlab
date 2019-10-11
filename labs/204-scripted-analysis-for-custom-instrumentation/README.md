## Custom Userspace Tracing And Scripted Analyzes

In this lab, you will learn how to instrument your own application using LTTng userspace instrumentation and we'll see how we can easily make analyzes and obtain meaningful views from these custom trace points.

*Pre-requisites*: Have Trace Compass installed and opened. Have lttng and the Generic Callstack add-on on Trace Compass installed. You can follow the [Installing TraceCompass](../006-installing-tracecompass/) lab or read the [TraceCompass web site](http://tracecompass.org) for more information.

- - -

### <a name="task3"></a>Task 3: Open the trace in Trace Compass

- - -

### Task 4: Script an Analysis With The Custom Trace

- - -

### Task 5: Draw a Time Line View For The Trace

- - -

### Task 6: Add Arrows To The Time Line View

- - -

### Conclusion

In the lab, you have compiled a program with tracing helpers, traced the `ls` command and saw the builtin views available for `LTTng UST` traces, ie the *LTTng-UST CallStack* and the *UST memory* views, as well as how we can leverage the userspace data with a system trace. You should now be able to analyze the execution of an application in details in terms of memory usage and function calls.

- - -

#### Next

* [Tracing Multiple Machines](../301-tracing-multiple-machines)
or
* [Back](../) for more options
