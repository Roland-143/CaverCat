from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from .config import Config
from .routes.health import health_blueprint
from .routes.checkout import checkout_blueprint
from .routes.email import email_blueprint


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": [app.config.get("FRONTEND_URL", "*")]}},
        supports_credentials=False,
    )

    app.register_blueprint(health_blueprint, url_prefix="/api")
    app.register_blueprint(checkout_blueprint, url_prefix="/api")
    app.register_blueprint(email_blueprint, url_prefix="/api")
    return app
