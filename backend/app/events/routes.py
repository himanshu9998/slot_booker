# app/events/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Event, TimeSlot, User
from app.extensions import db
from datetime import datetime

event_bp = Blueprint("events", __name__, url_prefix="/api/events")


@event_bp.route("/create", methods=["POST"])
@jwt_required()
def create_event():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    timezone = data.get("timezone")
    slots = data.get("slots", [])  # [{ "datetime": ISO8601, "max_bookings": int }]

    if not title or not timezone or not slots:
        return jsonify({"error": "Title, timezone, and slots are required"}), 400

    # 🔑 identity is user.id as *string*  → convert to int
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    event = Event(
        user_id=user.id,
        title=title,
        description=description,
        timezone=timezone,
    )
    db.session.add(event)
    db.session.flush()  # event.id available

    for slot in slots:
        dt_utc = datetime.fromisoformat(slot["datetime"])
        db.session.add(
            TimeSlot(
                event_id=event.id,
                datetime_utc=dt_utc,
                max_bookings=slot["max_bookings"],
            )
        )

    db.session.commit()
    return jsonify({"message": "Event created", "event_id": event.id}), 201
