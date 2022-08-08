## Installing LTTng on Ubuntu

In this lab, you will install lttng on an Ubuntu machine

*Pre-requisites*: Have root access to an ubuntu LTS machine

- - -

### Task 1: Install lttng for kernel tracing

First make sure your package manager list is up to date

```
$ sudo apt update
```

For kernel tracing only, the **lttng-modules-dkms** and **lttng-tools** packages need to be installed:

```
$ sudo apt install lttng-tools lttng-modules-dkms
```

The package installation will have created a group called **tracing**. This group allows its members to be able to run lttng commands without requiring to be *sudo* and, in consequence, to save traces that are directly readable by the user instead of saving them as root. The installation does not add the user to the **tracing** group, so you may do it at this point.

```
$ sudo usermod -a -G tracing $USER
```
Make sure to log off and log in the user to apply the groups modification. You can also start a shell logged in the tracing group using:

```
newgrp tracing
```

You are now ready to get a kernel trace. You may proceed to the [Record a kernel trace](../003-record-kernel-trace-lttng) lab or install additional packages to get more tracing options. Most of them will be covered in later labs, so it is advised to install them now.

- - -

### Task 2: Install LTTng's additional packages for different purposes

To trace userspace applications with some builtin features, for example function entry and exit, application memory allocations and other calls to the libc library:

```
$ sudo apt install liblttng-ust0
```

To add userspace tracepoints to your own application:

```
$ sudo apt install liblttng-ust-dev
```

To trace Java applications instrumented with either JUL or Log4j:

```
$ sudo apt install liblttng-ust-agent-java
```

To instrument and trace python3 applications:

```
$ sudo apt install python3-lttngust
```

- - -

### References

* [LTTng website](http://lttng.org)
* [Installation instructions for Ubuntu](https://lttng.org/docs/v2.10/#doc-ubuntu)
* [Instructions for other distributions](https://lttng.org/download/)

- - -

#### Next

* [Record kernel trace with LTTng](../003-record-kernel-trace-lttng) to record a kernel trace
or
* [Back](../) for more options
