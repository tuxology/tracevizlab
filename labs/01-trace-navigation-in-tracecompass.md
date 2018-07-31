### Trace Navigation in Trace Compass

In this lab, you will learn to open a trace in Trace Compass and navigate the various views available. We will see in future labs what each of those views mean and what we can make of it.

*Pre-requisites*: Have Trace Compass installed and opened. You can follow the [Installing TraceCompass](00-installing-tracecompass.md) lab or read the [TraceCompass web site](https://tracecompass.org) for more information. You also need a trace to open. You can take the trace you did in the [Record a kernel trace](00-record-kernel-trace.md) lab or take one of the traces coming with this tutorial.

- - -

#### Sub-task 1: Opening a trace

Upon opening Trace Compass, there is a default project named *Tracing* in the ``Project Explorer``, expand it and right-click on the *Traces* folder. Select *Import...* to open the *Trace Import* wizard.

![ImportTraceMenu](screenshots/importTraceMenu.png "Trace Compass Import Trace Menu")

Browse for the folder containing the trace, then check that folder in the left textbox as shown in the screenshot below and click *Finish*.

![ImportTraceDialog](screenshots/importTraceDialog.png "Trace Compass Import Trace Dialog")

A trace named kernel will show up under the *Traces* folder. You can double-click on it to actually open it. This will open the *Kernel* perspective

![KernelTraceJustOpened](screenshots/kernelTraceJustOpened.png "Kernel Trace Just Opened")

- - -

#### Sub-task 2: Navigate in time graph views

The main view that shows when opening a kernel trace is the ``Resources`` view, showing CPUs and interrupts on the left table and statuses on the right. The scale at the top shows the time in the trace. This type of view is called a *time graph view*. Make sure this view is the one with focus by clicking on the title tab.

When the trace first opens, it shows the first 100 milliseconds of the trace.

You can **zoom out to see the complete trace** by double-clicking on the time graph scale or click on the house icon:

![FullTimeScale](screenshots/fullTimeScale.png "Time Graph View Reset Time Scale")

You can zoom in and out in time and pan the view left and right by using the ``'w'``, ``'a'``, ``'s'``, ``'d'`` keyboard shortcuts or ``ctrl-scroll`` and ``middle-click + mouse move``, this last one can also pan the view up and down.

The ``up`` and ``down`` arrows, and the ``mouse scroll`` moves the view up and down, while the ``left`` and ``right`` arrows will go to the next and previous events of the currently selected entry.

Time selection is done with the mouse, by ``left-clicking`` on a timestamp to select a single time, or ``left-drag`` to select a time range. Zooming in to a time range is done by ``right-drag``ging the mouse to that time range. All the opened views, as well as the events table will synchronize with the time selection and/or visible time ranges.

- - -

#### Sub-task 3: Filter out some entries in time graph views

The ``Resources`` view shows for each CPU 3 lines: the running thread, the CPU state and its frequency. Let's say we want to hide the frequency lines from the view.

Click on the ``Show View Filters`` icon at the left of the toolbar and uncheck the CPU X Frequency lines. The filter and the result are shown in the following screenshot:

![TimeGraphViewFilter](screenshots/timeGraphViewFilter.png "Time Graph View Filter")

- - -

#### Sub-task 4: Change the color of the states

Views like the ``Resources`` view have built-in colors for some of the states that are displayed. For instance, the **Running** state is green, **System call** is blue, **Idle** is green and the line is thinner.

To get the meaning of the colored states and change their style (color, width), you can click on the ``Legend`` icon. The window that opens shows the legend of the current view and allows to change the colors by cliking on the color rectangle, or the width by using the gradient line right of the name. The arrow button at the end of each line will reset to defaults.

In the following screenshot, we've change the color and width of the **System call** state.

![TimeGraphViewLegend](screenshots/timeGraphViewLegend.png "Time Graph View Legend")

- - -

#### Sub-task 5: Use the histogram to navigate the trace

There's a view at the bottom of the window called ``Histogram``. This view shows the density of events in time, so you can see in one glance where in the trace the most events occurred. At the bottom is the full time range of the trace and above is the window range, ie the visible range in the other views. This view can be used to navigate the trace, as you can change selection and visible range in both sections of the view.

In any of those 2 histograms, ``left-click + drag`` will change the selection range, while ``right-click + drag`` will change the visible range. You may also manually change the selection range or the zoom level by editing the text boxes on the left.

You can play with the visible and selection ranges with this view and observe how the other views are updated. The following screenshot summarizes those concept.

![HistogramTimeRanges](screenshots/histogramTimeRanges.png "Time Ranges With The Histogram View")

- - -

#### Sub-task 6: Open more analyses and views

In the ``Project Explorer`` view, the trace we are analyzing can be expanded. Under it are 3 elements: ``Views``, ``External Analyses`` and ``Reports``. The analyses we will be using in this tutorial are under the ``Views`` element, so let's expand it.

It shows a list of available analyses for this trace. Under each analyses are the views that can be opened to analyze the trace.

Let's open the ``CPU Usage`` view under the ``CPU usage`` analysis, the ``Disk I/O Activity`` view under the ``Input/Output`` analysis, and the ``System Call Latency Statistics`` under the ``System Call Latency`` analysis.

Your workspace should look like this

![KernelWorkspaceViewsOpened](screenshots/kernelWorkspaceViewsOpened.png "Workspace after opening some views")

We have previously seen the *time graph views*. With the new views just opened, we have 2 new types of views: statistics views and XY views

- - -

#### Sub-task 7: Explore the statistics views

Let's now look at the ``System Call Latency Statistics`` view. It shows statistics on the times taken to execute system calls by the various processes in the trace, for each system call. We have the minimum and maximum time taken, the average time and the standard deviation, the number of calls and the total spent in that kind of system call.

Now click on the column headers to sort the results by this column. For each line of system call, if you right-click on it, you can navigate to the time range of minimum and maximum value, as shown in the figure below

![TraceCompassStatisticsView](screenshots/traceCompassStatisticsView.png "Statistics View Go To Maximum")

Now that you have a time range selected, you can scroll up (or down depending on current sorting) the statistics view and notice that the statistics are shown both for the total duration of the trace and for the current time selection. So whenever you select a new time range in the trace, the selection statistics will be updated.

- - -

#### Sub-task 8: Navigate in XY Views

Let's now look at one the XY views, say the ``CPU Usage`` view. Click on the tab of the view to put it into focus. This view is split in two, with a checkbox tree on the left side and an XY chart on the right side. If the view is too small, you can ``double-click on the tab`` of the view to make it full window size.

By default, this view shows the total CPU usage in time. The checkbox tree on the left shows the list of threads that were active on the CPU during the current window range (ie the visible time).

You can enlarge the left side to make all columns visible by ``left-click and drag`` the bar that separates the 2 sections of the view. It will show for each entry the TID, the % of CPU utilization, the total time spent on CPU and the legend. You can sort that table by clicking on the the column headers.

You can check the individual threads to display their CPU usages on the chart on the right, as shown in the figure below.

![TraceCompassCpuUsage](screenshots/traceCompassCpuUsage.png "CPU Usage view")

Double-clicking on the tab again will reduce the view to its original size.

- - -

#### Conclusion

In the lab, you've opened a trace in Trace Compass and should now know what types of views are available and some basic functionnalities and navigation options with each type. You should also be able to find the various views available for a trace and navigate through those views' ranges.
