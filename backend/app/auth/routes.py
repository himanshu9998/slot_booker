from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db
import jwt
import datetime
import os
from flask_mail import Message
from backend.app.extensions import mail
from flask import current_app, url_for
from flask_jwt_extended import create_access_token
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(name=name, email=email)
    user.set_password(password)

    # 👇 Mark user as verified directly
    user.is_verified = True

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'})




from flask_jwt_extended import create_access_token

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # 🔑 create_access_token automatically sets {"sub": identity, "iat", "exp", ...}
    access_token = create_access_token(
        identity=str(user.id),           # must be str to satisfy “Subject must be a string”
        expires_delta=datetime.timedelta(hours=12)
    )

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {"id": user.id, "name": user.name, "email": user.email}
    })





@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')

    if not token:
        return jsonify({'error': 'Verification token missing'}), 400

    try:
        data = jwt.decode(token, os.getenv('SECRET_KEY', 'dev_secret'), algorithms=["HS256"])
        email = data.get('email')
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.is_verified:
        return jsonify({'message': 'Email already verified'}), 200

    user.is_verified = True
    user.verification_token = None
    db.session.commit()

    return jsonify({'message': 'Email verified successfully'})




