from datetime import datetime, time

from flask import Blueprint, request, jsonify
from database import db
from models.order_model import Order
from models.menu_model import MenuItem
from models.deal_model import Deal

admin_bp = Blueprint("admin_bp", __name__)


ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Sent to Kitchen",
    "Food Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
]


def get_date_range():
    date_value = request.args.get("date")

    if not date_value:
        return None, None

    try:
        selected_date = datetime.strptime(date_value, "%Y-%m-%d").date()
    except ValueError:
        return "INVALID", "INVALID"

    # Pakistan time UTC+5
    local_start = datetime.combine(selected_date, time.min)
    local_end = datetime.combine(selected_date, time.max)

    utc_start = local_start - timedelta(hours=5)
    utc_end = local_end - timedelta(hours=5)

    return utc_start, utc_end

def apply_date_filter(query):
    start_datetime, end_datetime = get_date_range()

    if start_datetime == "INVALID":
        return None

    if start_datetime and end_datetime:
        query = query.filter(
            Order.created_at >= start_datetime,
            Order.created_at <= end_datetime
        )

    return query


@admin_bp.route("/dashboard", methods=["GET"])
def dashboard():
    query = apply_date_filter(Order.query)

    if query is None:
        return jsonify({
            "success": False,
            "message": "Invalid date format. Use YYYY-MM-DD"
        }), 400

    total_orders = query.count()
    pending_orders = query.filter_by(status="Pending").count()
    confirmed_orders = query.filter_by(status="Confirmed").count()
    delivered_orders = query.filter_by(status="Delivered").count()
    cancelled_orders = query.filter_by(status="Cancelled").count()

    total_sales = db.session.query(
        db.func.sum(Order.total_amount)
    )

    start_datetime, end_datetime = get_date_range()

    if start_datetime != "INVALID" and start_datetime and end_datetime:
        total_sales = total_sales.filter(
            Order.created_at >= start_datetime,
            Order.created_at <= end_datetime
        )

    total_sales = total_sales.filter(Order.status != "Cancelled").scalar() or 0

    active_menu_items = MenuItem.query.filter_by(is_active=True).count()
    active_deals = Deal.query.filter_by(is_active=True).count()

    return jsonify({
        "success": True,
        "dashboard": {
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "confirmed_orders": confirmed_orders,
            "delivered_orders": delivered_orders,
            "cancelled_orders": cancelled_orders,
            "total_sales": total_sales,
            "active_menu_items": active_menu_items,
            "active_deals": active_deals,
            "date": request.args.get("date")
        }
    })


@admin_bp.route("/orders", methods=["GET"])
def admin_get_orders():
    query = apply_date_filter(Order.query)

    if query is None:
        return jsonify({
            "success": False,
            "message": "Invalid date format. Use YYYY-MM-DD"
        }), 400

    orders = query.order_by(Order.id.desc()).all()

    return jsonify({
        "success": True,
        "orders": [order.to_dict() for order in orders],
        "date": request.args.get("date")
    })


@admin_bp.route("/sales-report", methods=["GET"])
def sales_report():
    query = apply_date_filter(Order.query)

    if query is None:
        return jsonify({
            "success": False,
            "message": "Invalid date format. Use YYYY-MM-DD"
        }), 400

    orders = query.order_by(Order.id.desc()).all()

    gross_sales = sum(order.total_amount for order in orders)
    net_sales = sum(
        order.total_amount
        for order in orders
        if order.status != "Cancelled"
    )

    payment_summary = {}

    for order in orders:
        payment_summary[order.payment_mode] = (
            payment_summary.get(order.payment_mode, 0) + order.total_amount
        )

    status_summary = {}

    for order in orders:
        status_summary[order.status] = status_summary.get(order.status, 0) + 1

    return jsonify({
        "success": True,
        "report": {
            "date": request.args.get("date"),
            "total_orders": len(orders),
            "gross_sales": gross_sales,
            "net_sales": net_sales,
            "payment_summary": payment_summary,
            "status_summary": status_summary,
            "orders": [order.to_dict() for order in orders]
        }
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