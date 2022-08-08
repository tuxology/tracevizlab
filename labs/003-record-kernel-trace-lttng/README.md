## Record a Kernel Trace With LTTng

In this lab, you will obtain a kernel trace that can then be analyzed by various visualization tools.

*Pre-requisite*: Have lttng installed. You can follow the [Installing LTTng on Ubuntu](../002-install-lttng-on-ubuntu/) lab, read the [LTTng Download page](https://lttng.org/download/) for installation instructions for other distributions or use a Virtual Machine with LTTng pre-installed, provided by the instructor.

- - -

### Task 1: Tracing session daemon

In order to trace with lttng, one first needs to have the tracing session daemon running as root. If you installed from packages, it should already be running. You can verify by running

```
$ systemctl status lttng-sessiond
```

If the service is available but not running, you can start it with

```
$ sudo systemctl start lttng-sessiond
```

If you installed from source or the service is not available on your distro, you can start the session daemon manually

```
$ sudo lttng-sessiond -d
```

- - -

### Task 2: Get a kernel trace

First, you need to create a tracing session. This session can be configured with various events.

```
$ lttng create
Session auto-20180723-180856 created.
Traces will be written in /home/virtual/lttng-traces/auto-20180723-180856
```

The output of the command will indicate where the trace will be saved.

The following commands will enable the events necessary to take advantage of a maximum of analyses in Trace Compass, without generating a trace too large.

```
$ lttng enable-event -k sched_switch,sched_waking,sched_pi_setprio,sched_process_fork,sched_process_exit,sched_process_free,sched_wakeup,\
irq_softirq_entry,irq_softirq_raise,irq_softirq_exit,irq_handler_entry,irq_handler_exit,\
lttng_statedump_process_state,lttng_statedump_start,lttng_statedump_end,lttng_statedump_network_interface,lttng_statedump_block_device,\
block_rq_complete,block_rq_insert,block_rq_issue,\
block_bio_frontmerge,sched_migrate,sched_migrate_task,power_cpu_frequency,\
net_dev_queue,netif_receive_skb,net_if_receive_skb,\
timer_hrtimer_start,timer_hrtimer_cancel,timer_hrtimer_expire_entry,timer_hrtimer_expire_exit
$ lttng enable-event -k --syscall --all
```

Next, you can start the tracing session

```
$ lttng start
```

Execute the payload to trace, here a simple ```wget``` command

```
$ wget https://lttng.org
```

Then stop and destroy the tracing session.

```
$ lttng destroy
```

- - -

### Task 3: Use a utility script to trace

The [lttng-utils](https://github.com/tahini/lttng-utils) script can be used to trace instead of the commands of the previous task. First, get and install the script

```
$ sudo pip3 install --upgrade git+https://github.com/tahini/lttng-utils.git@master
```

See the README for more install options. Once installed, you can just run the trace record script with the command to run. For instance, to reproduce the same result as the previous task, simply do

```
$ lttng-record-trace wget https://lttng.org
```

The trace will be saved in the current directory, unless you specify an ``--output`` path to the command line

- - -

### Task 4: Retrieve the trace

If the trace was not taken on the machine on which trace visualization will happen (for example, in a VM provided by the instructors), then the trace needs to be brought on the trace viewing machine. An LTTng trace consists in a directory with a metadata files, one tracing file and one index file for each CPU traced. To retrieve this, rsync is the best command

```
$ rsync -avz <user>@<traced.host>:</path/to/trace/dir> traces/
```

- - -

### References

* [LTTng user documentation](http://lttng.org/docs)
* [lttng-utils](https://github.com/tahini/lttng-utils) tracing helper documentation

- - -

#### Next

* [Record kernel trace with ftrace](../004-record-kernel-trace-ftrace) to record a kernel trace with ftrace
or
* [Installing Trace Compass](../006-installing-tracecompass) to install the visualization tool
or
* [Back](../) for more options
