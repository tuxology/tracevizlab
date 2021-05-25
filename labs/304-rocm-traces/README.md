## Tracing and Analysing ROCm traces in Trace Compass

This tutorial will guide you through getting a trace with ROC-profiler and ROC-tracer and opening it with the Theia-trace-extensions.

*Disclaimer*: A lot of tools and commands are subject to change, thus this tutorial might not be up-to-date.

*Pre-requisites*:
- Have ROCm installed with a [compatible GPU](https://github.com/RadeonOpenCompute/ROCm#Hardware-and-Software-Support) with ROC-profiler and ROC-tracer. You can follow the [ROCm Installation](https://rocmdocs.amd.com/en/latest/Installation_Guide/Installation-Guide.html) to get everything installed.
- Have babeltrace2 and python3-bt2 installed. Once you have added the LTTng ppa, you will be able to install python3-bt2 through apt. [Get babeltrace](https://babeltrace.org/#bt2-get)
- Java 11
    Ubuntu: `apt-get install openjdk-11-jdk`
    Fedora: `dnf install java-11-openjdk.x86_64`
- If you intend to use the Theia trace extension, you will need to install the [pre-requisites for the Theia IDE](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites)

- - -

### Task 1: Tracing with ROC-tracer and ROC-profiler

ROCm comes with two profiling tools [ROC-profiler]() and [ROC-tracer](). Both are piloted using the same rocprof script. To get a trace you just need a program that uses the ROCm stack to execute, it can be a deep learning application that uses the ROCm pytorch or a C++ that uses HIP kernels. If you need more details, you can look at [AMD's documentation](https://rocmdocs.amd.com/en/latest/ROCm_Tools/ROCm-Tools.html). In this tutorial we will focus on tracing and not on performance counters.
There are three types of events: activity events, API events and user annotations. The activity events are all the GPU related events, it can be memory transfers or kernel executions. The API events are tracepoints at the beginning and end of every API functions. The API can be HSA, HIP or KFD. And finally, you can place your own tracepoints in your application and they will generate user annotation events, using the roctx library.
To get a trace that records HIP API calls using rocprof, you can run the following command:
```
$ rocprof --hip-trace <your_program>
```
This will generate 'results' files. You can use some of these with automated scripts, the file that is useful to generate a CTF trace is the 'results.db' file. If you want a different name for these files, you can use the '-o' parameter.

### Task 2: Generate a CTF trace using babeltrace

In the scripts folder, two scripts are present: ctftrace.py and bt_plugin_rocm.py. These files are using babeltrace to convert the sqlite database file obtained at the previous task to a CTF trace readable by Trace Compass.
```
$ python3 ctftrace.py <trace_name>.db
```
This can take some time to generate the CTF trace if your trace file is over 500 MB.

### Task 3: Run the Theia trace extension

You can also open the trace with [Trace Compass](../006-installing-tracecompass/), but we will not cover that use case in this tutorial.

To open the trace with the Theia-trace-extension, you will need to build the example application. We will explain how to do it here but for reference, here is a link to the [official instructions](https://github.com/theia-ide/theia-trace-extension#build-the-extension-and-example-application).

1. Clone the theia-trace-extensions repository `git clone https://github.com/theia-ide/theia-trace-extension.git`
2. `cd theia-trace-extensions`
3. Download the Trace Compass Server: `yarn download:server`
3. Build the application: `yarn`
4. Run the browser app: `yarn start:browser`

### Task 4: Opening the trace with the Theia trace extension

![theia-trace-extension-open-trace](https://raw.githubusercontent.com/tuxology/tracevizlab/master/labs/304-rocm-traces/screenshots/openATrace.gif)