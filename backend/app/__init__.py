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
    load_dotenv()
    app = Flask(__name__)

    # ✅ Correct CORS configuration — place IMMEDIATELY after app is created
    CORS(app,
         origins=["https://slot-booker-fe.onrender.com"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"]
    )

    # ✅ Correct config load path
    app.config.from_object("backend.app.config.Config")

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)
    with app.app_context():
        db.create_all()
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(event_bp, url_prefix="/api/events")
    app.register_blueprint(booking_bp, url_prefix="/api/bookings")

    return app


# Only needed if you're running directly
app = create_app()
