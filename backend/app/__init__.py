# app/__init__.py
import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

# Blueprints
from backend.app.auth.routes import auth_bp
from backend.app.events.routes import event_bp
from backend.app.bookings.routes import booking_bp


# Extensions
from backend.app.extensions import db, migrate, mail, jwt


def create_app():
    load_dotenv()                    # Load .env variables first
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────

    CORS(app,
             origins=["https://slot-booker-fe.onrender.com"],
             supports_credentials=True,
             methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allow_headers=["Content-Type", "Authorization"]
        )
     app.config.from_object("backend.app.config.Config")          # your Config class


    # ── Init extensions ──────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)

    # ── Register blueprints ───────────────────────────────
    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(event_bp,   url_prefix="/api/events")
    app.register_blueprint(booking_bp, url_prefix="/api/bookings")

    return app

app = create_app()

