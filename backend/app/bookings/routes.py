from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Booking, TimeSlot
from datetime import datetime

booking_bp = Blueprint('booking', __name__)

# Book a time slot
@booking_bp.route("/<event_uuid>/bookings", methods=["POST"])
def book_slot(event_uuid):
    data = request.get_json()
    slot_id = data.get("slot_id")
    name = data.get("name")
    email = data.get("email")

    if not all([slot_id, name, email]):
        return jsonify({"message": "Missing fields"}), 400

    slot = TimeSlot.query.filter_by(id=slot_id).first()
    if not slot:
        return jsonify({"message": "Invalid slot"}), 404

    # Prevent duplicate booking
    existing = Booking.query.filter_by(slot_id=slot_id, email=email).first()
    if existing:
        return jsonify({"message": "You have already booked this slot."}), 400

    if len(slot.bookings) >= slot.max_bookings:
        return jsonify({"message": "This slot is fully booked."}), 400

    booking = Booking(
        slot_id=slot_id,
        name=name,
        email=email,
        created_at=datetime.utcnow()
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({"message": "Booking successful!"}), 201

# Optional: View bookings by email
@booking_bp.route("/user/<email>", methods=["GET"])
def get_user_bookings(email):
    bookings = Booking.query.filter_by(email=email).order_by(Booking.created_at.desc()).all()
    result = []
    for booking in bookings:
        result.append({
            "slot_id": booking.slot_id,
            "event_id": booking.slot.event_id,
            "datetime_utc": booking.slot.datetime_utc.isoformat(),
            "created_at": booking.created_at.isoformat()
        })
    return jsonify(result), 200
