from flask import Blueprint, request, jsonify
from models.order_model import Order

tracking_bp = Blueprint("tracking_bp", __name__)


@tracking_bp.route("/", methods=["POST"])
def track_order():
    data = request.get_json()

    tracking_number = data.get("tracking_number")
    phone = data.get("phone")

    if not tracking_number and not phone:
        return jsonify({
            "success": False,
            "message": "Tracking number or WhatsApp number is required"
        }), 400

    query = Order.query

    if tracking_number and phone:
        order = query.filter_by(
            tracking_number=tracking_number,
            phone=phone
        ).first()
    elif tracking_number:
        order = query.filter_by(tracking_number=tracking_number).first()
    else:
        order = query.filter_by(phone=phone).order_by(Order.id.desc()).first()

    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404

    return jsonify({
        "success": True,
        "order": order.to_dict()
    })