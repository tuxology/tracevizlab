import bt2
import bt_plugin_rocm
import os
import pathlib
import sys
from datetime import datetime


def translate_to_ctf(input_db, output):
    graph = bt2.Graph()

    plugin_path = os.path.join(pathlib.Path(__file__).parent, "bt_plugin_rocm.py")
    rocm_plugin = bt2.find_plugins_in_path(plugin_path, fail_on_load_error=True)[0]
    source_component = graph.add_component(
        rocm_plugin.source_component_classes["RocmSource"],
        "rocm_source",
        { "input": input_db }
    )

    ctf_plugin = bt2.find_plugin("ctf").sink_component_classes["fs"]
    sink_component = graph.add_component(
        ctf_plugin,
        "ctf_sink",
        { "path": output, "assume-single-trace": True }    
    )

    utils_plugin = bt2.find_plugin("utils").filter_component_classes["muxer"]
    muxer_component = graph.add_component(
        utils_plugin,
        "muxer"
    )

    for i, port in enumerate(source_component.output_ports):
        graph.connect_ports(
            source_component.output_ports[port],
            muxer_component.input_ports["in{}".format(i)]
        )

    graph.connect_ports(
        muxer_component.output_ports["out"],
        sink_component.input_ports["in"]
    )

    graph.run()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise Exception("Usage: " + sys.argv[0] + " <output DB file>")
    # Generate trace name as a folder named <output_filename>.YYYYMMDD-hhmmss
    trace_name = ".".join(sys.argv[1].split(".")[:-1]) + "." + datetime.now().strftime("%Y%m%d-%H%M%S")
    translate_to_ctf(sys.argv[1], trace_name)
