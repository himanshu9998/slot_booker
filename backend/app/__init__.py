from flask_cors import CORS

def create_app():
    load_dotenv()
    app = Flask(__name__)

    # Proper CORS setup
    CORS(app,
         origins=["https://slot-booker-fe.onrender.com"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"]
    )

    app.config.from_object("backend.app.config.Config")

    # Register Blueprints and Init Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(event_bp, url_prefix="/api/events")
    app.register_blueprint(booking_bp, url_prefix="/api/bookings")

    return app
