from flask import Blueprint, request, jsonify
from database import db
from models.order_model import Order
from models.menu_model import MenuItem
from models.deal_model import Deal

admin_bp = Blueprint("admin_bp", __name__)


ORDER_STATUSES = [
    "Pending Confirmation",
    "Confirmed",
    "Sent to Kitchen",
    "Food Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
]


@admin_bp.route("/dashboard", methods=["GET"])
def dashboard():
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(
        status="Pending Confirmation"
    ).count()
    delivered_orders = Order.query.filter_by(status="Delivered").count()

    total_sales = db.session.query(
        db.func.sum(Order.total_amount)
    ).filter(Order.status != "Cancelled").scalar() or 0

    active_menu_items = MenuItem.query.filter_by(is_active=True).count()
    active_deals = Deal.query.filter_by(is_active=True).count()

    return jsonify({
        "success": True,
        "dashboard": {
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "delivered_orders": delivered_orders,
            "total_sales": total_sales,
            "active_menu_items": active_menu_items,
            "active_deals": active_deals
        }
    })


@admin_bp.route("/orders", methods=["GET"])
def admin_get_orders():
    orders = Order.query.order_by(Order.id.desc()).all()

    return jsonify({
        "success": True,
        "orders": [order.to_dict() for order in orders]
    })


@admin_bp.route("/orders/<int:order_id>/status", methods=["PATCH"])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    new_status = data.get("status")

    if not new_status:
        return jsonify({
            "success": False,
            "message": "Status is required"
        }), 400

    if new_status not in ORDER_STATUSES:
        return jsonify({
            "success": False,
            "message": "Invalid status",
            "allowed_statuses": ORDER_STATUSES
        }), 400

    order.status = new_status
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Order status updated successfully",
        "order": order.to_dict()
    })


@admin_bp.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)

    db.session.delete(order)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Order deleted successfully"
    })


@admin_bp.route("/statuses", methods=["GET"])
def get_statuses():
    return jsonify({
        "success": True,
        "statuses": ORDER_STATUSES
    })