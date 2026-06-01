from flask import Blueprint, request, jsonify
from models.order_model import Order

tracking_bp = Blueprint("tracking_bp", __name__)


@tracking_bp.route("/", methods=["POST"])
def track_order():
    data = request.get_json()

    tracking_number = data.get("tracking_number")
    phone = data.get("phone")

    if not tracking_number or not phone:
        return jsonify({
            "success": False,
            "message": "Tracking number and phone number are required"
        }), 400

    order = Order.query.filter_by(
        tracking_number=tracking_number,
        phone=phone
    ).first()

    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404

    return jsonify({
        "success": True,
        "order": order.to_dict()
    })