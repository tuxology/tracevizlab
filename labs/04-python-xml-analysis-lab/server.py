import lttngust
from time import sleep
from flask import Flask
app = Flask(__name__)


def tracing_entry():
    app.logger.info("route_entry")

def tracing_exit(response):
    app.logger.info("route_exit")
    return response

@app.route("/")
def main():
    sleep(0.01)
    return "Hello World"

@app.route("/resource1")
def resource1():
    sleep(0.05)
    return "resource"

@app.route("/resource2")
def resource2():
    sleep(0.042)
    return "resource"

@app.route("/resource3")
def resource3():
    sleep(0.0156)
    return "resource"

@app.route("/resource4")
def resource4():
    sleep(0.0273)
    return "resource"


if __name__ == "__main__":
    app.before_request(tracing_entry)
    app.after_request(tracing_exit)
    app.run(port=5000)