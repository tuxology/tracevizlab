## Record a Kernel Trace With Ftrace

While this tutorial will mainly use LTTng for tracing, as it can provide both kernel and userspace traces, synchronized on the same time reference, it is also possible to get the same results for kernel tracing using `ftrace`. Ftrace has the advantage that it is builtin the linux kernel and many people are used to it. In this lab, you will obtain a kernel trace that can then be analyzed by the visualization tools, using ftrace and trace-cmd.

- - -

### Task 1: Install trace-cmd

`trace-cmd` is a helper application for ftrace that does not require to directly set values in debugfs in order to trace. It is available as a package in most linux distributions, so to install, just ask your preferred package manager, for instance

```
sudo apt install trace-cmd
```

- - -

### Task 2: Record a trace with trace-cmd

The following commands will enable the events necessary to take advantage of a maximum of analyses in Trace Compass, without generating a trace too large. It is the equivalent of the trace generated in the lttng tutorial.

```
$ sudo trace-cmd record -e sched_switch -e sched_waking -e sched_pi_setprio -e sched_process_fork \
-e sched_process_exit -e sched_process_free -e sched_wakeup  \
-e softirq_entry -e softirq_raise -e softirq_exit -e irq_handler_entry -e irq_handler_exit \
-e block_rq_complete -e block_rq_insert -e block_rq_issue \
-e block_bio_frontmerge -e cpu_frequency \
-e net_dev_queue -e netif_receive_skb \
-e hrtimer_start -e hrtimer_cancel -e hrtimer_expire_entry -e hrtimer_expire_exit \
-e sys* \
wget https://lttng.org
```

- - -

### Task 3: Get the Trace For TraceCompass

TraceCompass supports ftrace traces in textual raw format. To obtain a file that can be imported in Trace Compass, you execute the following command:

```
$ sudo trace-cmd report -R > myFtrace.txt
```

Then you can import `myFtrace.txt` in TraceCompass and it should be recognized as an ftrace trace.

You can also import the binary trace directly, but only if `trace-cmd` is available on the machine where TraceCompass is. The ftrace binary format calls the `trace-cmd report -R` command to obtain the trace. It just avoids the user having to do the step above.

- - -

### Task 4: Record a Trace With DebugFS

If `trace-cmd` cannot be installed, it is possible to use ftrace directly in the debugfs. Here is how to obtain the same result as above:

```bash
sudo mount -t debugfs nodev /sys/kernel/debug
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_wakeup/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_switch/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_waking/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_pi_setprio/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_process_fork/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_process_exit/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/sched/sched_process_free/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/irq/softirq_raise/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/irq/softirq_entry/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/irq/softirq_exit/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/irq/irq_handler_entry/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/irq/irq_handler_exit/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/block/block_rq_complete/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/block/block_rq_insert/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/block/block_rq_issue/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/block/block_bio_frontmerge/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/power/cpu_frequency/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/net/net_dev_queue/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/net/netif_receive_skb/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/timer/hrtimer_start/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/timer/hrtimer_cancel/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/timer/hrtimer_expire_entry/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/timer/hrtimer_expire_exit/enable
sudo echo 1 > /sys/kernel/debug/tracing/events/syscalls/enable
sudo echo 1 > /sys/kernel/debug/tracing/tracing_on

# Something to trace
wget https://lttng.org

sudo echo 0 > /sys/kernel/debug/tracing/tracing_on
```

Then, to obtain the trace to import in TraceCompass:

```
$ sudo cat /sys/kernel/debug/tracing/trace > myFtraceFile.txt
```

- - -

#### Next

* [Record kernel trace with perf](../005-record-kernel-trace-perf) to record a kernel trace with perf
or
* [Installing Trace Compass](../006-installing-tracecompass) to install the visualization tool
or
* [Back](../) for more options
