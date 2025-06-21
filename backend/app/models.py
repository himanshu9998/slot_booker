# app/models.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

from app.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(256), nullable=True)  # Increased from 64 to 256

    events = db.relationship('Event', backref='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    timezone = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    slots = db.relationship('TimeSlot', backref='event', lazy=True, cascade="all, delete-orphan")

class TimeSlot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    datetime_utc = db.Column(db.DateTime, nullable=False)
    max_bookings = db.Column(db.Integer, nullable=False)

    bookings = db.relationship('Booking', backref='slot', lazy=True, cascade="all, delete-orphan")

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slot_id = db.Column(db.Integer, db.ForeignKey('time_slot.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('slot_id', 'email', name='_slot_email_uc'),
    )
