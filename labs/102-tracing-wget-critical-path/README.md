## Tracing wget and showing the critical path

In this lab, you will learn to view the critical path of a process, compare two executions of the same program and understand what is happening behind the scenes. In a program, a task may wait for the result of another task, these wait dependencies can be seen using the critical path analysis. This analysis highlights the active path from the trace and is displayed in the *Critical Flow View*.

![KernelWaitAnalysisDjango](screenshots/kernelWaitAnalysisDjango.png "Trace Compass Kernel Wait Analysis")

*Pre-requisites*: Have Trace Compass installed and opened. You can follow the [Installing TraceCompass](../006-installing-tracecompass/) lab or read the [TraceCompass web site](http://tracecompass.org) for more information. You also need to know how to record a trace and open it in Trace Compass. You can that learn by doing the [Record a kernel trace](../003-record-kernel-trace-lttng/) lab and the [Trace Navigation in Trace Compass](../101-trace-navigation-in-tracecompass/).

- - -

### Task 1: Recording two executions of wget

You need to save two traces of the same wget instruction. You can either use [lttng-record-trace](https://github.com/tahini/lttng-utils)
or use lttng directly to trace the command:

```
$ lttng-record-trace wget http://www.dorsal.polymtl.ca
```
or
```
$ lttng create
$ lttng enable-event -k -a
$ lttng start
$ wget http://www.dorsal.polymtl.ca
$ lttng destroy
```

- - -

### Task 2: Open two traces in the same project

Open the two traces created in the previous task. You can add both by simply selecting the parent folder of both traces when importing trace files.

![ImportMultipleTrace](screenshots/importMultipleTrace.png "Trace Compass Import Multiple Traces")

- - -

### Task 3: An Overview of Trace Compass

After opening the *Kernel* perspective of one of the trace, you can see the *Control Flow View* by clicking on the Control Flow tab beside the *Resources* tab.

![DefautlView](screenshots/defaultView.png "Trace Compass Default View")

This is what you should see:

![ControlFlowView](screenshots/controlFlowView.png "Trace Compass Control Flow View")

Most of views are accessible in the *Project Explorer View* or by accessing *Window > Show View*. Here is a description of what is shown in the previous screenshot:

- The *Project Explorer View* is the standard Eclipse project explorer.

- The *Control Flow View* is a LTTng-specific view and is accessible under the Linux Kernel element in the *Project Explorer View*. It is useful to see the state of each process state with respect to time.

- The *Events Editor View* shows the basic trace data elements parsed into a table. It is possible to filter elements by writing into the first row of this table. Most of the views are generated using these events.

- The *Histogram View* displays the events distribution with respect to time.

In this lab, you will use the critical path to analyze the differences between the two executions of wget. To show the critical path you need to open the *Critical Flow View*: *Views > OS Execution Graph > Critical Flow View* and follow the process you want to analyze.


- - -

### Task 4: Comparing two views

To compare two critical paths, you need two *Critical Flow View* from the two traces you have. You need to pin the view to one trace then in the view menu (shown in the screenshot) select `new view, pinned to <second trace>`.

![PinToFirstTrace](screenshots/pinToFirstTrace.png "Trace Compass Pin to First Trace")

![NewViewPinnedToSecond](screenshots/newViewPinnedToSecond.png "Trace Compass New View Pinned to Second")

- - -

### Task 5: Search for a process in the control flow and show critical path

In the *Control Flow View*, to follow one process, you can search for the process wget by hitting the shortcut `ctrl-f` and then typing the name of the process.

![SearchProcessTrace](screenshots/searchProcessTrace.png "Trace Compass Search Process")

Once you have done that, you can right-click on the wget line and select `Follow wget/<pid>` where pid is the Process ID of wget in your trace. As we can see, for this example, you would've selected `Follow wget/12243`. Then, the critical path should appear in the corresponding critical flow view.

![FollowProcess](screenshots/followProcess.png "Trace Compass Follow Process")

You should then replicate this for the other trace and move one of the views to see both at the same time, it should look like this:

![CompareCriticalPaths](screenshots/compareCriticalPaths.png "Trace Compass Compare Critical Paths")

- - -

### Task 6: Critical path analysis

![CriticalPaths](screenshots/criticalPaths.png "Trace Compass Critical Paths")

After navigating in the *Critical Flow View*, you can see the two critical paths in their entirety. In the first call to wget (bottom graph) the purple indicates that the process is waiting for a device. In this case it is waiting for the disk to load the program wget into memory. The green indicates that the process is running and pink shows that the process is waiting for the network.

![MeasureTimeDifference](screenshots/measureTimeDifference.png "Trace Compass Measure Time Difference")

We can see the time difference between the two executions by simply selecting the range of the process activity for each critical path. The time span will be displayed at the bottom of the window.

With the critical path analysis, you can see that the second execution was much faster for two reasons:
 1) The program was already in memory
 2) The request was better routed the second time

- - -

### Conclusion

In the lab, you've learned how to use Trace Compass to find and compare the critical path of some wget process executions. The critical path can help find the root cause of why a process is particularly slow, why it was blocked.
