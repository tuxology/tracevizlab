## Record a Kernel Trace With Perf

While this tutorial will mainly use LTTng for tracing, as it can provide both kernel and userspace traces, synchronized on the same time reference, it is also possible to get the same results for kernel tracing using `perf`. Like ftrace, perf has the advantage that it is builtin the linux kernel and many people are used to it. It can do both sampling or tracing, it is a very flexible tracer. In this lab, you will obtain a kernel trace that can then be analyzed by the visualization tools.

*Note on perf*: The perf binary trace is _not_ readable by Trace Compass. It has to be converted to CTF. [CTF or Common Trace Format](http://diamon.org/ctf/), is a binary trace format, very flexible and fast to write. It is the format used by LTTng kernel and userspace traces. There is a perf2ctf converter built in perf, but it requires compilation of perf with `libbabeltrace`, a library providing an API to write CTF in C. Most distro do not have this option compiled in and compiling it yourself means compiling the linux kernel sources. Debian has it, but we know of no other distro with this feature.

- - -

### Task 1: Install perf

`perf` is an application for performance analysis. It is available as part of linux tools in most linux distributions, so to install, just ask your preferred package manager, for instance

```
sudo apt install linux-tools-generic
```

- - -

### Task 2: Record a Trace With Perf

`perf` is a tool that can be used either for sampling, tracing or gathering performance counters. It is very flexible and can provide a lot of useful information. The [perf documentation](https://perf.wiki.kernel.org/index.php/Main_Page) contains exhaustive information on the various perf commands and option.

Here, we will show how to trace the kernel events, so we can obtain a trace equivalent to the ftrace and lttng kernel traces. We will again trace the `ls` command and get its trace.

```
$ sudo perf record -a -e sched:sched_switch -e sched:sched_waking \
-e sched:sched_pi_setprio -e sched:sched_process_fork -e sched:sched_process_exit \
-e sched:sched_process_free -e sched:sched_wakeup \
-e irq:softirq_entry -e irq:softirq_raise -e irq:softirq_exit \
-e irq:irq_handler_entry -e irq:irq_handler_exit \
-e block:block_rq_complete -e block:block_rq_insert -e block:block_rq_issue \
-e block:block_bio_frontmerge -e power:cpu_frequency \
-e net:net_dev_queue -e net:netif_receive_skb \
-e timer:hrtimer_start -e timer:hrtimer_cancel -e timer:hrtimer_expire_entry -e timer:hrtimer_expire_exit \
-e syscalls:sys_enter_* -e syscalls:sys_exit_* \
wget https://lttng.org
```

- - -

### Task 3: Convert the Trace to CTF

To open it in TraceCompass, the trace has to be converted to CTF. To do so, use the following command.

```
$ sudo perf data convert [--all] --to-ctf /path/to/ctf/folder
```

The `--all` option will also convert the mmap and mmap2 events used to map loaded libraries to the address spaces of processes. These events will all have a timestamp of 0 in the resulting trace, thus making the trace appear "longer" than it is. It is not necessary for kernel tracing, as mapping is not used, but for sampling, where symbols need to be resolved to the proper library/function, then it should be present to allow proper symbol resolution.

If you get the following error message, then you're out of luck, the CTF conversion support is not compiled in.

```
No conversion support compiled in. perf should be compiled with environment variables LIBBABELTRACE=1 and LIBBABELTRACE_DIR=/path/to/libbabeltrace/
```

You may use `lttng` or `ftrace` to obtain a kernel trace to visualize.

- - -

#### Next

* [Installing Trace Compass](../006-installing-tracecompass) to install the visualization tool
or
* [Back](../) for more options
