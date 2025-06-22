# app/bookings/routes.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from backend.app.extensions import db
from backend.app.models import TimeSlot, Booking

booking_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")


# ───────────────────────────────────────────────
# 1. Create a booking  (public – no auth)
#    POST /api/bookings/<slot_id>
# ───────────────────────────────────────────────
@booking_bp.route("/<int:slot_id>", methods=["POST"])
def book_slot(slot_id: int):
    """Book a specific time-slot by ID."""
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")

    # Basic validation
    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    # Fetch slot (and event via relationship if needed)
    slot: TimeSlot | None = TimeSlot.query.get(slot_id)
    if slot is None:
        return jsonify({"error": "Time slot not found"}), 404

    # Check capacity
    if len(slot.bookings) >= slot.max_bookings:
        return jsonify({"error": "This time slot is fully booked"}), 409

    # Prevent duplicate booking for same slot & email
    if Booking.query.filter_by(slot_id=slot_id, email=email).first():
        return jsonify({"error": "You have already booked this slot"}), 409

    # Create booking
    booking = Booking(
        slot_id=slot_id,
        name=name,
        email=email,
        created_at=datetime.utcnow(),
    )
    db.session.add(booking)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Could not save booking, try again"}), 500

    return jsonify({"message": "Booking successful!"}), 201


# ───────────────────────────────────────────────
# 2. (Optional) List bookings for an e-mail
#    GET /api/bookings?email=someone@example.com
# ───────────────────────────────────────────────
@booking_bp.route("/", methods=["GET"])
def list_bookings_by_email():
    """Return past bookings filtered by email (optional feature)."""
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email query-param is required"}), 400

    bookings = (
        Booking.query.join(TimeSlot)
        .filter(Booking.email == email)
        .order_by(Booking.created_at.desc())
        .all()
    )

    result = [
        {
            "booking_id": b.id,
            "event_id": b.slot.event_id,
            "slot_id": b.slot_id,
            "datetime_utc": b.slot.datetime_utc.isoformat(),
            "booked_at": b.created_at.isoformat(),
        }
        for b in bookings
    ]

    return jsonify({"bookings": result})
