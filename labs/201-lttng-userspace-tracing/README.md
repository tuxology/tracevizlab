## LTTng Userspace Tracing

In this lab, you will learn to compile for tracing and analyze C/C++ programs, using LTTng UST. We will see the various analyzes available with the builtin lttng userspace libraries.

*Pre-requisites*: Have Trace Compass installed and opened. Have git, lttng and the callstack add-on on Trace Compass installed. You can follow the [Installing TraceCompass](../006-installing-tracecompass/) lab or read the [TraceCompass web site](http://tracecompass.org) for more information.

- - -

### Task 1: Compiling and tracing `ls` from coreutils

In this lab you will use the coreutils package to compile and trace the `ls` command. In order to do that we need the source code for this package which can be download with git:

```bash
git clone git://git.sv.gnu.org/coreutils
```

Then you will need to compile `ls` with the proper flags by running these commands in coreutils/:

```bash
$ ./bootstrap
$ ./configure CFLAGS="-g -O2 -finstrument-functions"
$ make
```

[clang](https://linux.die.net/man/1/clang) and [gcc](https://linux.die.net/man/1/gcc) have the flag `-finstrument-functions` which generates instrumentation calls for function entry and exit. A more detailed explanation can be found [here](https://lttng.org/docs/v2.10/#doc-liblttng-ust-cyg-profile). Then after compiling coreutils the `ls` executable is located in `coreutils/src/`.

You can generate the trace using the following command in the `coreutils/` directory:

```bash
$ lttng-record-trace -p cyg_profile,libc ./src/ls -l
```

or to manually create the trace, the following commands can be run
```bash
$ lttng create
$ lttng enable-channel u -u --subbuf-size 1024K --num-subbuf 8
$ lttng enable-event -c u -u lttng_ust_cyg_profile*,lttng_ust_statedump*
$ lttng add-context -c u -u -t vpid -t vtid
$ lttng start
$ LD_PRELOAD="liblttng-ust-cyg-profile.so liblttng-ust-libc-wrapper.so" ./src/ls -l
$ lttng destroy
```

These tracing commands will trace 2 types of events:

* The function entry/exits because the program was compiled with the proper instrumentation and the `liglttng-ust-cyg-profile.so` library was LD_PRELOADed.
* The libc function calls, like calloc, malloc and free, done by the application, simply by LD_PRELOADing the `liblttng-ust-libc-wrapper.so` library.

- - -

### Task 2: Visualizing cyg profile traces

In the previous task, you generated a trace of the `ls` command that contains all the function calls. You can open this trace on Trace Compass and you should see in the *Project Explorer View*, under Views, the *LTTng-UST CallStack* tree view. Under this, four views are present:

* The *Flame Chart View* shows the state of the stack at all moments during the trace. That view shows for all threads of the application, the functions that were called, so it's easy to see who called who and when. If you do not see human-readable names for the functions, see the next section of this lab.

![FlameChart](screenshots/flameChart.png "Trace Compass Flame Chart View")

* The *Flame Graph View* looks similar to the *Flame Chart View* but it is different. Each box represents a function in the stack but the horizontal axis show the total aggregated duration of all calls to this function at a particular level. A more complete explanation is available [here](http://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html#Description).

![FlameGraph](screenshots/flameGraph.png "Trace Compass Flame Graph View")

`For a more complete understanding of the difference between Flame Charts and Flame Graphs`, see [this additional document](FlameChartsVsFlameGraphs.md)

* The *Function Durations Distribution View* is a bar graph that shows the number of function calls with respect to their duration. The count is using a logarithmic scale. In this example it shows that very few functions takes longer than 0.5 seconds.

![FunctionDurationDistribution](screenshots/functionDurationDistribution.png "Trace Compass Function Duration Distribution View")

* The *Function Duration Statistics View* is a table with each function's minimum, maximum, average duration and other statistical parameters that may show that in certain cases, the duration can be bigger or lower depending on the context. In this case `print_dir` can take a long time to execute depending on the size of the directory.

![FunctionDurationStatistics](screenshots/functionDurationStatistics.png "Trace Compass Function Duration Statistics View")

- - -

### Task 3: Understanding the symbols

The events used to populate this view are lttng_ust_cyg_profile[\_fast]:func_entry and lttng_ust_cyg_profile[\_fast]:func_exit. In the events fields, there's the 'addr' field that is used to identify the function being called. Depending on which machine you are now viewing this trace, the one where the trace was taken or not, the flame chart view will display the human readable name of the function or the cryptic 'addr' field.

![CygProfileEntryExit](screenshots/entryExitEvents.png "Trace Compass Cyg-profile Entry Exit Events")

If Trace Compass is running on the machine where the trace was taken (the target), you should see the function names directly. That's because you also recorded the ``lttng_ust_statedump:*`` events. Some of them contain the absolute path to the binary files. So if those files are available, there will be automatic source lookup of the symbols and translation to the human readable name of the function.

![StateDumpBinInfo](screenshots/statedumpBinInfo.png "Trace Compass Statedump bin_info Events")

If you are not running Trace Compass on the machine where the trace was taken, chances are the binary files being traced is not present at the path in the events, or else it is, but it's not exactly the same version, so symbols will not be right. In those cases, you need to configure how to resolve the symbols. To do this, you can right-click on the trace and select `Configure symbols` from the menu, or click on the symbol configuration icon in the views.

![ConfigureSymbols](screenshots/configureSymbols.png "Trace Compass Configure Symbols")

You have several options. For automatic source lookup, you can set the root directory under which the files from the target are located. The directory specified should contain full directory structure of the target, so let's say a file being trace is `/usr/local/bin/ls`, and the target root directory is `/home/me/target`, it is expected there will be a file `/home/me/target/usr/local/bin/ls`. This is a typical case for embedded system where the target OS was compiled on another machine and sent to the target.

![SymbolRootDirectory](screenshots/configureSymbolsRootDirectory.png "Trace Compass Configure Symbols For Binary Source Lookup")

If you do not have the full file system of the target, you can just add the files containing the symbol resolution. They can be either

* the binary that was used for taking the trace.
* a file generated from the binary using `nm myprogram > mapping.txt`. If you are dealing with C++ executables, you may want to use `nm --demangle` instead to get readable function names.

![SymbolRootDirectory](screenshots/configureSymbolsNameMapping.png "Trace Compass Configure Symbols Name Mapping")

For this lab, if you did not produce the trace yourself on the machine used for viewing, you can add the executable file provided in the `traces/` directory.

- - -

### Task 4: Memory usage

The trace was recorded using the lttng-ust libc wrapper, to trace calls to libc functions for memory allocation/deallocation. With the trace opened in Trace Compass, under *Views*, you may expand the *Ust Memory* analysis and see the views for this analysis.

* The *UST Memory Usage* views shows in time when the memory was allocated and freed, per thread. The UST memory view can show the memory usage of an application as it executes, when more memory was needed, when it was freed. In conjunction with the *Callstack* analysis views, it can be used to see more greedy code paths.

![UstMemoryUsage](screenshots/ustMemoryUsage.png "Trace Compass UST Memory Usage View")

* The *Potential Leaks* view shows the memory that was allocated during the trace but not freed. This could be totally normal if the trace does not span the whole lifetime of a process/thread, or it can be some still reachable memory that does not pose a leak.

![UstMemoryPotentialLeaks](screenshots/ustMemoryPotentialLeaks.png "Trace Compass UST Memory Potential Leaks View")

* The *Potential Leaks vs time* view shows the same information as the *Potential Leaks* view, but as a scatter chart, so it's possible to visually see in time when exactly the memory was allocated.

*Note* The potential leaks views are not meant to detect real memory leak. For that, tools like [Valgrind](http://valgrind.org/) are better suited and will tell you the exact line of code where the leak happened. But sometimes, knowing where the leaked memory was allocated does not help with the why it was not freed. In those cases, seeing it here with the full execution trace (callstacks, path to/from allocation), can help better put it in context. Also, adding a kernel trace to it, could add information, for instance show a failed system call around that time which may give a hint as to why it was not deallocated.

- - -

### Task 5: Tracing Userspace and Kernel

Even better than tracing userspace only is to observe both a userspace and kernel space traces together! You can skip to the next task if you are using the traces provided by this tutorial.

To trace both kernel and userspace, once you have compiled an application with the `-finstrument-functions` flag, you can do one of the following

```bash
$ lttng-record-trace -p cyg_profile,libc,kernel <my/executable command>
```

or to manually create the trace:
```bash
$ lttng create
$ lttng enable-event -u lttng_ust_cyg_profile*,lttng_ust_statedump*
$ lttng enable-event -k sched_switch,sched_waking,sched_pi_setprio,sched_process_fork,sched_process_exit,sched_process_free,sched_wakeup,\
irq_softirq_entry,irq_softirq_raise,irq_softirq_exit,irq_handler_entry,irq_handler_exit,\
lttng_statedump_process_state,lttng_statedump_start,lttng_statedump_end,lttng_statedump_network_interface,lttng_statedump_block_device,\
block_rq_complete,block_rq_insert,block_rq_issue,\
block_bio_frontmerge,sched_migrate,sched_migrate_task,power_cpu_frequency,\
net_dev_queue,netif_receive_skb,net_if_receive_skb,\
timer_hrtimer_start,timer_hrtimer_cancel,timer_hrtimer_expire_entry,timer_hrtimer_expire_exit
$ lttng enable-event -k --syscall --all
$ lttng start
$ LD_PRELOAD="liblttng-ust-cyg-profile.so liblttng-ust-libc-wrapper.so" <my/executable command>
$ lttng destroy
```

Notice that unlike the commands above for tracing userspace application only, we do not need the `vtid` and `vpid` contexts, as the kernel trace will provide this information.

You may now import the traces in Trace Compass.

- - -

### Task 6:

In the `network-experiment`, we traced `wget` instrumented with `-finstrument-functions`, as well as the kernel. Let's open those 2 traces in an *experiment*, ie multiple traces opened as one, all events together. First, select the `clientKernel` and `clientUst` traces under the `network-experiment` folder. Right-click on the selected traces, then select `Open As Experiment...` -> `Generic Experiment`. It will create an experiment under the `Experiments` folder and open it.

![OpenKernelUstExperiment](screenshots/openKernelUstExperiment.png "Open As Experiment")

The kernel views like `Control Flow` and `Resources` will get populated, as well as the userspace views described above.

To have a more direct view of the `Flame Chart` with the kernel, if you have installed the `Generic Callstack (Incubator)` add-ons (explained in the "[Installing TraceCompass](../006-installing-tracecompass/)" labs), you can expand the `Experiment` folder, `Experiment`, `Views`, `LTTng-UST Callstack (Incubator)` and double-click on the `Flame Chart (incubator)` and the `Flame Graph (incubator)` views.

![IncubatorFlameViews](screenshots/incubatorFlameViews.png "Open Incubator Flame Views")

To resolve the symbols properly, you need to add the `wget` executable, located in the `traces` folder of this labs to the `Configure Symbols...` menu, in the tab title `GNU nm - [...]/clientUst` as shown below

![UstKernelConfigureSymbols](screenshots/ustKernelConfigureSymbols.png "Userspace Kernel Configure Symbols")

In the `Flame Chart (incubator)` view, below the callstack lines, we see a line showing the `Kernel Statuses`. That line is the same as the one from the `Control Flow` view, but is more practical as it does not need the 2 views opened together. This allows to see that even though the `connect_with_timeout_callback` function appears to take a lot of time, the thread was actually blocked most of the time.

![UstKernelFlameChart](screenshots/ustKernelFlameChart.png "Userspace Kernel Flame Chart")

By adding the kernel data to the userspace, we can compute the actual `CPU time` for each of the function. That information is available in the tooltip of the `Flame Graph (incubator)` view. So for the `connect_with_timeout_callback` function, we see that even though the total duration is 24 milliseconds, the actual CPU time of this function is only 76 microseconds.

![UstKernelFlameGraph](screenshots/ustKernelFlameGraph.png "Userspace Kernel Flame Graph")

We can obtain the critical path for the observed threads directly from the `Flame Chart (incubator)` view. We just right-click on the thread entry on the left, named `9512` and select the `Follow 9512/9512`.

![UstKernelFollowThread](screenshots/ustKernelFollowThread.png "Userspace Kernel Follow Thread")

This will show the critical path for this thread, which shows that the time during which we were blocked, it was waiting for the network, which is not surprising when tracing the `wget` process, but which can be very eye-opening for other applications. We also notice that the `main` function starts a few milliseconds after the process start. Looking at the rest of the critical path and the `Control Flow` view, we can observe the `lttng` preloading setup for this application taking place.

![UstKernelCriticalPath](screenshots/ustKernelCriticalPath.png "Userspace Kernel Critical Path")

Other kernel and userspace views can be opened together to observe, for instance, disk utilization during the thread's execution (though it would not say if the disk utilization is due to this thread, more investigation is needed) or system's total CPU usage, or where in the thread some system calls were made, etc. This allows to dig deeper into the application's behavior and interaction with the system, with rather simple and automatic instrumentation.

- - -

### Conclusion

In the lab, you have compiled a program with tracing helpers, traced the `ls` command and saw the builtin views available for `LTTng UST` traces, ie the *LTTng-UST CallStack* and the *UST memory* views, as well as how we can leverage the userspace data with a system trace. You should now be able to analyze the execution of an application in details in terms of memory usage and function calls.

- - -

#### Next

* [Exercice: Bug Hunt](../202-bug-hunt)
or
* [Back](../) for more options
