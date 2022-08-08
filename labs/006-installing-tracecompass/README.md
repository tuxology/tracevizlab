## Installing Trace Compass

In this lab, you will install Trace Compass on the machine you'll use to view the traces.

*Pre-requisites*: A viewing machine, it does not have to be a Linux machine.

- - -

### Task 1: Install Java > 11

#### On Ubuntu machines

Trace Compass is an Eclipse-based application and needs at least Java 11 to run. Make sure you have the correct version.

```
$ java -version
openjdk version "11.0.11" 2021-04-20
OpenJDK Runtime Environment (build 11.0.11+9-Ubuntu-0ubuntu2.18.04)
OpenJDK 64-Bit Server VM (build 11.0.11+9-Ubuntu-0ubuntu2.18.04, mixed mode, sharing)
```

If the java command is not found or you have an older version of java installed, you need to install java. On an ubuntu machine, it would be

```
$ sudo apt-get install openjdk-11-jre
$ java -version
openjdk version "11.0.11" 2021-04-20
OpenJDK Runtime Environment (build 11.0.11+9-Ubuntu-0ubuntu2.18.04)
OpenJDK 64-Bit Server VM (build 11.0.11+9-Ubuntu-0ubuntu2.18.04, mixed mode, sharing)
```

If the version is still not correct, you may need to update your default java version using the following command

```
$ sudo update-alternatives --config java
There are 2 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                            Priority   Status
------------------------------------------------------------
* 0            /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java      1101      auto mode
  1            /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java      1101      manual mode
  2            /usr/lib/jvm/java-11-openjdk-amd64/jre/bin/java   1111      manual mode

Press <enter> to keep the current choice[*], or type selection number: **2**
```

- - -

#### On other platforms

In Windows and MacOs, download Temurin OpenJDK from Eclipse Adoptium [here](https://adoptium.net/)

### Task 2: Get Trace Compass

Go to the [Trace Compass web site](http://tracecompass.org) and click on the big blue button to download the latest release of Trace Compass.

Then extract the content of the downloaded archive and simply start trace-compass from the extracted folder

```
$ cd ~/Downloads
$ tar xf trace-compass-8.0.0-20220620-0814-linux.gtk.x86_64.tar.gz
$ cd trace-compass
$ ./tracecompass
```

You should reach an empty workspace. And voilà! You are now ready to import and analyze traces with Trace Compass. Proceed to other labs.

![empty workspace](screenshots/emptyWorkspace.png "Trace Compass empty workspace")

- - -

### Task 3: Install the Required Add-Ons For This Tutorial

Some labs in this tutorial require additional plugins that are not part of the main Trace Compass tool, but are available through the Trace Compass Incubator repo.  We will add those required plugins now.

To install the plugins, go to the *Tools* -> *Add-ons*

![Addons](screenshots/addons.png "Addons")

A dialog will open with a list of plugins that can be installed. For this tutorial, we will needs the following:

* **Generic Callstack (Incubator)**: For various labs
* **Global Filters (Incubator)**: For various labs
* **Trace Compass Scripting Javascript (Incubation)**: For scripting labs
* **Trace Compass ftrace (Incubation)**: If you have system traces with ftrace
* **Virtual Machine And Container Analysis (Incubator)**: For advanced topics with containers and virtual machine
* **Trace Compass opentracing (Incubation)**: For advanced topic with opentracing

Check those plugins in the *Install* wizard, as shown below. Then click *Finish* and follow the instructions on screen. Trace Compass will have to be restarted at the end of the process.

![AddonsGenericCallstack](screenshots/genericCallStackAddons.png "Addons GenericCallstack")

- - -

### Task 4: Import the Traces For The Tutorial

Each lab comes with the instructions to produce the traces yourself, so *if you plan on making your own traces, you may skip this step*. Otherwise, there is an [archive](../TraceCompassTutorialTraces.tgz) that contains all the traces for the labs. You may import it now.

Upon opening Trace Compass, there is a default project named *Tracing* in the ``Project Explorer``, expand it and right-click on the *Traces* folder. Select *Import...* to open the *Trace Import* wizard.

![ImportTraceMenu](screenshots/importTraceMenu.png "Trace Compass Import Trace Menu")

Check the *Select archive file* radio-button and find the archive you want to import.

![ImportTraceDialog](screenshots/importTraceDialog.png "Trace Compass Import Trace Dialog")

The list on the left will show the folder structure inside that archive, you can select the top-level element and click *Finish*. Make sure the options are as shown above, ie the *Preserve folder structure* is **checked** and *Create experiment* is **unchecked**.

All the traces should be available, each under a folder named for the lab that uses them.

![AllTracesJustImported](screenshots/tutorialTracesImported.png "Tutorial Traces Imported")

- - -

#### Next

* [Trace Navigation in Trace Compass](../101-analyze-system-trace-in-tracecompass)
or
* [Back](../) for more options
