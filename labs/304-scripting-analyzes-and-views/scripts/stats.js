loadModule("/TraceCompass/Trace");
loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');

// Get the currently active trace
var trace = getActiveTrace();

if (trace == null) {
	  print("Trace is null");
	  exit();
}

// Get the Statistics module (by name) for that trace
var analysis = getTraceAnalysis(trace, 'Statistics');
if (analysis == null) {
	  print("Statistics analysis not found");
	  exit();
}

// Prepare the parameters for the data provider:
var map = new java.util.HashMap();
map.put(ENTRY_PATH, 'event_types/sched_wakeup|syscall_exit_futex');
map.put(ENTRY_DELTA, true);
// create a XY data provider
var provider = createXYProvider(analysis, map);

// Open an XY chart with this data provider
if (provider != null) {
	  openXYChartView(provider);
}
