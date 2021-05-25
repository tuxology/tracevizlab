"""
This module is a source plugin for babeltrace 2 to read traces from ROC-tracer and ROC-profiler.

To add or edit an event type, you have to :
    - Add/Edit a parsing function which takes the row as parameters.
    - Add/Edit the SQL table name in the table_name_to_event_type dictionary associated with the event type.
    - Add/Edit an entry into the event_types dictionary filling in get_row_func and the fields keys.

If you have fields that are optional for the event type, you need to:
    - Add the added_field parameters to the parsing function
    - Add the fields with the add_optional_fields function in the __init__ method of the RocmSource class.
"""

import bt2
import os
import uuid
import sys
import sqlite3
import time
from heapq import heappush, heappop


def get_compute_kernel_hsa_row(row, added_fields):
    added_fields = { field: int(row[field]) for field in added_fields }
    return (
        int(row["BeginNs"]),
        int(row["EndNs"]),
        {
            **added_fields,
            "kernel_name" : row["KernelName"],
            "gpu_id": int(row["gpu-id"]),
            "queue_id": int(row["queue-id"]),
            "kernel_dispatch_id": int(row["Index"]),
            "pid": int(row["pid"]),
            "tid": int(row["tid"]),
            "grd": int(row["grd"]),
            "wgr": int(row["wgr"]),
            "lds": int(row["lds"]),
            "scr": int(row["scr"]),
            "vgpr": int(row["vgpr"]),
            "sgpr": int(row["sgpr"]),
            "fbar": int(row["fbar"]),
            "sig": row["sig"],
            "obj": row["obj"],
            "dipatch_time": int(row["DispatchNs"]),
            "complete_time": int(row["CompleteNs"]),
        }
    )

def get_hcc_ops_row(row):
    return (
        int(row["BeginNs"]),
        int(row["EndNs"]),
        {
            "name": row["Name"],
            "queue_id": int(row["queue-id"]),
            "tid": int(row["tid"]),
            "pid": int(row["proc-id"]),
            "stream_id": int(row["dev-id"]),
            "index": int(row["Index"])
        }
    )

def get_async_copy_row(row):
    return (
        int(row["BeginNs"]),
        int(row["EndNs"]),
        {
            "pid": int(row["proc-id"]),
            "name": "async-copy",
            "index": row["Index"]
        }
    )

def get_api_row(row):
    return (
        int(row["BeginNs"]),
        int(row["EndNs"]),
        {
            "tid": int(row["tid"]),
            "name": row["Name"],
            "args": row["args"],
            "index": int(row["Index"])
        }
    )

def get_roctx_row(row):
    pass
    return (
        int(row["BeginNs"]),
        -1,
        {
            "pid": int(row["pid"]),
            "tid": int(row["tid"]),
            "name": row["Name"],
        }
    )


table_name_to_event_type = {
    "A": "compute_kernels_hsa",
    "OPS": "hcc_ops",
    "COPY": "async_copy",
    "HSA": "hsa_api",
    "HIP": "hip_api",
    "KFD": "kfd_api",
    "rocTX": "roctx"
}
event_types = {
    "compute_kernels_hsa": {
        "get_row_func": get_compute_kernel_hsa_row,
        "fields": {
            "kernel_name" : "string",
            "gpu_id": "unsigned_integer",
            "queue_id": "unsigned_integer",
            "kernel_dispatch_id": "unsigned_integer",
            "pid": "unsigned_integer",
            "tid": "unsigned_integer",
            "grd": "unsigned_integer",
            "wgr": "unsigned_integer",
            "lds": "unsigned_integer",
            "scr": "unsigned_integer",
            "vgpr": "unsigned_integer",
            "sgpr": "unsigned_integer",
            "fbar": "unsigned_integer",
            "sig": "string",
            "obj": "string",
            "dipatch_time": "unsigned_integer",
            "complete_time": "unsigned_integer",
        }
    },
    "hcc_ops": {
        "get_row_func": get_hcc_ops_row,
        "fields": {
            "name": "string",
            "queue_id": "unsigned_integer",
            "tid": "unsigned_integer",
            "pid": "unsigned_integer",
            "stream_id": "unsigned_integer",
            "index": "unsigned_integer",
        }
    },
    "async_copy": {
        "get_row_func": get_async_copy_row,
        "fields": {
            "pid": "unsigned_integer",
            "name": "string",
            "index": "unsigned_integer",
        }
    },
    "hsa_api": {
        "get_row_func": get_api_row,
        "fields": {
            "tid": "unsigned_integer",
            "name": "string",
            "args": "string",
            "index": "unsigned_integer",
        }
    },
    "hip_api": {
        "get_row_func": get_api_row,
        "fields": {
            "tid": "unsigned_integer",
            "name": "string",
            "args": "string",
            "index": "unsigned_integer",
        }
    },
    "kfd_api": {
        "get_row_func": get_api_row,
        "fields": {
            "tid": "unsigned_integer",
            "name": "string",
            "args": "string",
            "index": "unsigned_integer",
        }
    },
    "roctx": {
        "get_row_func": get_roctx_row,
        "fields": {
            "pid": "unsigned_integer",
            "tid": "unsigned_integer",
            "name": "string",
        }
    },
}


def connect_to_db(input_db):
    if os.path.isfile(input_db) and input_db[-3:] == ".db":
        connection = sqlite3.connect(input_db)
        return connection
    return None


def detect_input_table(connection):
    cursor_tables = connection.cursor()
    cursor_tables.execute("SELECT name FROM sqlite_master WHERE type='table';")
    event_types_detected = {}
    for table in cursor_tables:
        row_count = connection.execute("SELECT COUNT(*) FROM " + table[0]).fetchone()
        if row_count[0] > 0:
            event_type = table_name_to_event_type[table[0]]
            event_types_detected[event_type] = {
                **event_types[event_type],
                    "table_input": table[0]
            }
    return event_types_detected


def get_payload_class(event_type, trace_class, payload_class):
    for field in event_type["fields"]:
        if event_type["fields"][field] == "string":
            payload_class += [(field, trace_class.create_string_field_class())]
        elif event_type["fields"][field] == "unsigned_integer":
            payload_class += [(field, trace_class.create_unsigned_integer_field_class())]
    if "added_fields" not in event_type: return
    for field in event_type["added_fields"]:
        payload_class += [(field, trace_class.create_unsigned_integer_field_class())]


def add_optional_fields(connection, event_type):
    cursor = connection.cursor()
    cursor.execute("PRAGMA table_info({})".format(event_type["table_input"]))
    blacklist = [
        *event_type["fields"].keys(), "Index", "KernelName", "gpu-id", "queue-id", "queue-index",
        "DispatchNs", "BeginNs", "EndNs","CompleteNs","DurationNs"
    ]
    event_type["added_fields"] = {}
    for row in cursor:
        if row[1] not in blacklist:
            event_type["added_fields"][row[1]] = "unsigned_integer"
    return event_type


class RocmAPIMessageIterator(bt2._UserMessageIterator):
    def __init__(self, config, self_output_port):
        self._trace = self_output_port.user_data["trace"]
        self._event_type = self_output_port.user_data["event_type"]
        self._connection = self_output_port.user_data["connection"]
        
        # Initializes the data objects for trace parsing
        self._stream = self._trace.create_stream(self._event_type["stream_class"])
        self._connection.row_factory = sqlite3.Row
        self._table_cursor = self._connection.execute("SELECT * FROM {} ORDER BY BeginNs;".format(self._event_type["table_input"]))

        # Because events are stored in a begin:end fashion, some end events occur after the
        # start of the next event. We store the event messages to keep the events ordered
        self._buffer = []
        self._size_buffer = 30
        self._insert_buffer_begin_end()
        # heappush and heappop will compare against the first element of the tuple. In this case,
        # this element is the timestamp. However, when the timestamps are equal, it will compare against
        # the second element, so to manage this case, we put a counter.
        self._integer = 0

    def _insert_buffer_begin_end(self):
        heappush(
            self._buffer,
            (0, 0, self._create_stream_beginning_message(self._stream))
        )
        heappush(
            self._buffer,
            (sys.maxsize, sys.maxsize, self._create_stream_end_message(self._stream))
        )

    def _process_row(self, row):
        # Parsing the line to get payload and timestamp information
        if "added_fields" in self._event_type:
            (time_begin, time_end, fields) = self._event_type["get_row_func"](row, self._event_type["added_fields"])
        else:
            (time_begin, time_end, fields) = self._event_type["get_row_func"](row)
        # Create event message
        def fill_and_push_msg(timestamp, fields, name_suffix):
            msg = self._create_event_message(
                self._event_type["event_class"],
                self._stream,
                default_clock_snapshot=timestamp
            )
            for field in fields:
                if field == "name":
                    msg.event.payload_field[field] = fields[field] + name_suffix
                else:
                    msg.event.payload_field[field] = fields[field]
            heappush(self._buffer, (timestamp, self._integer, msg))
            self._integer += 1
        # Separate begin and end: enter/exit
        fill_and_push_msg(time_begin, fields, "_enter")
        # Some events have no end time
        if time_end >= 0:
            fill_and_push_msg(time_end, fields, "_exit")

    def __next__(self):
        # Reading from the current event type table if the queue buffer is empty
        try:
            # Fill the buffer to its capacity
            while len(self._buffer) < self._size_buffer:
                row = next(self._table_cursor)
                self._process_row(row)
            msg_send = heappop(self._buffer)[2]
            return msg_send
        except StopIteration:
            # Empty buffer
            while len(self._buffer) > 0:
                msg_send = heappop(self._buffer)[2]
                return msg_send
            self._table_cursor.close()
            raise StopIteration


@bt2.plugin_component_class
class RocmSource(bt2._UserSourceComponent, message_iterator_class=RocmAPIMessageIterator):
    def __init__(self, config, params, obj):
        # Checks what types of event are available
        self.connection = connect_to_db(str(params["input"]))
        if self.connection is None:
            raise Exception("Trace input not supported: {}".format(params["input"]))
        event_types_available = detect_input_table(self.connection)

        # Add performance counter to the list of fields of compute_kernels_hsa
        if "compute_kernels_hsa" in event_types_available:
            event_types_available["compute_kernels_hsa"] = add_optional_fields(
                self.connection, event_types_available["compute_kernels_hsa"])

        # Initiliazes the metadata objects of the trace
        rocm_trace = self._create_trace_class()
        # Initializes the clock
        frequency = 1000000000
        offset = time.time() - time.clock_gettime(time.CLOCK_MONOTONIC)
        offset_seconds = int(offset)
        offset_cycles = int((offset - offset_seconds) * frequency)
        clock_class = self._create_clock_class(
            name="rocm_monotonic",
            frequency=frequency, # 1 GHz
            precision=1, # Nanosecond precision
            offset=bt2.ClockClassOffset(offset_seconds, offset_cycles),
            origin_is_unix_epoch=True,
            uuid=uuid.uuid4()
        )
        for event_type in event_types_available:
            # Stream classes
            event_types_available[event_type]["stream_class"] = (
                rocm_trace.create_stream_class(default_clock_class=clock_class)
            )
            # Field classes
            payload_class = rocm_trace.create_structure_field_class()
            event_types_available[event_type]["payload_class"] = payload_class
            get_payload_class(event_types_available[event_type], rocm_trace, payload_class)
            # Event classes
            event_types_available[event_type]["event_class"] = (
                event_types_available[event_type]["stream_class"].create_event_class(
                    name=event_type,
                    payload_field_class=event_types_available[event_type]["payload_class"])
            )
        # Same trace object for all ports
        trace = rocm_trace(environment={ "tracer_name": "roctracer" })
        for event_type in event_types_available:
            self._add_output_port(
                "out_" + event_type,
                {
                    "trace": trace,
                    "event_type": event_types_available[event_type],
                    "connection": self.connection
                }
            )
    
    def _user_finalize(self):
        self.connection.close()


bt2.register_plugin(
    __name__,
    "rocm",
    description="rocprofiler/roctracer format",
    author="Arnaud Fiorini"
)
