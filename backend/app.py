from flask import Flask
import call_routes

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello world"


app.register_blueprint(call_routes.routes, url_prefix="/call")


if __name__ == "__main__":
    app.run(port=2020)
