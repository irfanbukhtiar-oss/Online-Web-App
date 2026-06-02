from flask import Blueprint, request, jsonify

from database import db
from models.order_model import Order, OrderItem
from utils.tracking_generator import generate_tracking_number
from utils.order_number_generator import generate_order_number

order_bp = Blueprint("order_bp", __name__)


@order_bp.route("/", methods=["POST"])
def place_order():
    data = request.get_json()

    required_fields = [
        "customer_name",
        "phone",
        "order_type",
        "payment_mode",
        "items"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    if not data["items"]:
        return jsonify({
            "success": False,
            "message": "Cart is empty"
        }), 400

    allowed_order_types = ["Delivery", "Takeaway", "Dine-in"]
    if data["order_type"] not in allowed_order_types:
        return jsonify({
            "success": False,
            "message": "Invalid order type"
        }), 400

    allowed_payment_modes = ["COD", "Card Payment", "QR Scan"]
    if data["payment_mode"] not in allowed_payment_modes:
        return jsonify({
            "success": False,
            "message": "Invalid payment mode"
        }), 400

    if data["payment_mode"] == "QR Scan" and not data.get("qr_transaction_id"):
        return jsonify({
            "success": False,
            "message": "QR Transaction ID is required"
        }), 400

    if data["order_type"] == "Delivery":
        if not data.get("address") and not data.get("google_location"):
            return jsonify({
                "success": False,
                "message": "Address or Google current location is required for delivery"
            }), 400

    total_amount = 0

    for item in data["items"]:
        total_amount += int(item["price"]) * int(item["quantity"])

    tracking_number = generate_tracking_number()
    order_number = generate_order_number()

    order = Order(
        order_number=order_number,
        tracking_number=tracking_number,
        customer_name=data["customer_name"],
        phone=data["phone"],
        address=data.get("address"),
        google_location=data.get("google_location"),
        order_type=data["order_type"],
        payment_mode=data["payment_mode"],
        qr_transaction_id=data.get("qr_transaction_id"),
        special_note=data.get("special_note"),
        total_amount=total_amount,
        status="Pending"
    )

    db.session.add(order)
    db.session.flush()

    for item in data["items"]:
        order_item = OrderItem(
            order_id=order.id,
            item_type=item["item_type"],
            item_id=int(item["item_id"]),
            name=item["name"],
            price=int(item["price"]),
            quantity=int(item["quantity"]),
            subtotal=int(item["price"]) * int(item["quantity"])
        )

        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Order placed successfully",
        "order": order.to_dict()
    }), 201


@order_bp.route("/", methods=["GET"])
def get_orders():
    orders = Order.query.order_by(Order.id.desc()).all()

    return jsonify({
        "success": True,
        "orders": [order.to_dict() for order in orders]
    })


@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)

    return jsonify({
        "success": True,
        "order": order.to_dict()
    })


@order_bp.route("/my-orders", methods=["POST"])
def get_my_orders():
    data = request.get_json()

    phone = data.get("phone")

    if not phone:
        return jsonify({
            "success": False,
            "message": "WhatsApp number is required"
        }), 400

    orders = Order.query.filter_by(phone=phone).order_by(Order.id.desc()).all()

    return jsonify({
        "success": True,
        "orders": [order.to_dict() for order in orders]
    })