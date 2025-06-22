# app/events/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.models import Event, TimeSlot, User
from backend.app.extensions import db
from datetime import datetime

event_bp = Blueprint("events", __name__, url_prefix="/api/events")

@event_bp.route('/<string:uuid>', methods=['GET'])
def get_event_details(uuid):
    event = Event.query.filter_by(uuid=uuid).first()
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    slots = [{
        'id': slot.id,
        'datetime_utc': slot.datetime_utc.isoformat(),
        'max_bookings': slot.max_bookings,
        'current_bookings': len(slot.bookings)
    } for slot in event.slots]

    return jsonify({
        'title': event.title,
        'description': event.description,
        'uuid': event.uuid,
        'timezone': event.timezone,
        'slots': slots
    })

@event_bp.route('/public', methods=['GET'])
def list_public_events():
    events = Event.query.all()
    event_list = [{
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'uuid': event.uuid,
        'timezone': event.timezone,
        'created_at': event.created_at.isoformat()
    } for event in events]
    return jsonify({'events': event_list})

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
