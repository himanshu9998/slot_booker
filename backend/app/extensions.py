# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
jwt = JWTManager()  # ✅ Add this line
