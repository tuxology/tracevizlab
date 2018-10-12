# Flame Charts vs Flame Graphs

This is a concept that has been explained to me way too many times until I understood it.

The difference is quite simple in terms of the data model.

A **Flame Chart** shows the callstack status vs time. So its model is a stack. The Trace Compass implementation was formerly called the callstack view, it supports showing the callstack status vs time as well as arrows that should represent forks, joins or interprocess communication. This is left up to the extender.

A **Flame Graph** shows the aggregated callstack time taken. Its model is a weighted tree. A **call tree view** shares the model with a flame graph. A **Flame Graph** decorates it differently. A traditional **Flame Graph** will show colors going from yellow to orange to red, like flames. Trace Compass takes a novel twist on this, the colors are the same as the **Flame Chart**. As Trace Compass provides both a **Flame Chart** and a **Flame Graph**, keeping the colors the same helps users associate one color to a function/method/span.

TL;DR: **Flame Chart**s show data vs wall clock, **Flame Graph**s aggregate that into a report.


## Comparison of Flame Chart and Flame Graph Tooltips

### Flame Chart
| key        |value  |
|---|---|
| Thread      |  Thread name |
|Start time | time| 
|End time | time| 
|Duration : ... | duration      |
| % of time selection: ... | percentage      |

### Flame Graph
| key        |value  |
|---|---|
| Depth      |  # |
|Number of calls | #| 
|Durations |       |
| total duration | duration      |
|Avg duration| duration|
|Min duration| duration|
|Max duration| duration|
|Standard Deviation| duration|
|Total time| duration|
|Self times||
| total duration | duration      |
|Avg duration| duration|
|Min duration| duration|
|Max duration| duration|
|Standard Deviation| duration|
|Total time| duration|

**Flame graphs** have no absolute time reference

## When to use Flame Charts and Flame Graphs

**Flame Graphs** show an executive summary of where time is spent in a trace. This is useful to know which functions can be easily optimized. It can also highlight when a function is called too often. It does not show the sequence of events though, nor will it show spurious slowdowns. **Flame Charts** are very useful to gain intimate knowledge of the flow of a program. If a function takes too long in the **Flame Graph**, the next logical step would be to investigate its behaviour in the **Flame Chart**. To do this, one feature that may help in Trace Compass is to right click on an element of the **Flame Graph** and through the context menu go to the Min/Max duration.


#Conclusion

**Flame Charts** and **Flame Graphs** are powerful tools that can work well together. The naming and slightly overlapping functionality make them difficult to grasp for new users, but they should be tools in the belts of every performance engineer. As long as one can derive a **Flame Chart** one can extract a **Flame Graph**, the converse is however false.
