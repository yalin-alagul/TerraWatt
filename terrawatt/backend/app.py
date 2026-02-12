from flask import Flask
from flask_cors import CORS
from routes.energy import energy_bp
from routes.emissions import emissions_bp
from routes.simulator import simulator_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(energy_bp, url_prefix="/api")
app.register_blueprint(emissions_bp, url_prefix="/api")
app.register_blueprint(simulator_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=False, port=5001, host='0.0.0.0', threaded=True)
