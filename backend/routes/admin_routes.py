from datetime import datetime, time, timedelta

from flask import Blueprint, request, jsonify

from database import db
from models.order_model import Order
from models.menu_model import MenuItem
from models.deal_model import Deal
from models.user_model import User


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


# ======================================================
# DATE FILTER HELPERS
# ======================================================

def get_date_range():
    date_value = request.args.get("date")
    start_date_value = request.args.get("start_date")
    end_date_value = request.args.get("end_date")

    try:
        if date_value:
            selected_date = datetime.strptime(date_value, "%Y-%m-%d").date()

            local_start = datetime.combine(selected_date, time.min)
            local_end = datetime.combine(selected_date, time.max)

            utc_start = local_start - timedelta(hours=5)
            utc_end = local_end - timedelta(hours=5)

            return utc_start, utc_end

        if start_date_value and end_date_value:
            start_date = datetime.strptime(start_date_value, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_value, "%Y-%m-%d").date()

            local_start = datetime.combine(start_date, time.min)
            local_end = datetime.combine(end_date, time.max)

            utc_start = local_start - timedelta(hours=5)
            utc_end = local_end - timedelta(hours=5)

            return utc_start, utc_end

    except ValueError:
        return "INVALID", "INVALID"

    return None, None


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


# ======================================================
# DASHBOARD / SALES REPORT
# ======================================================

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

    sales_query = db.session.query(db.func.sum(Order.total_amount))
    sales_query = apply_date_filter(sales_query)

    if sales_query is None:
        return jsonify({
            "success": False,
            "message": "Invalid date format. Use YYYY-MM-DD"
        }), 400

    total_sales = (
        sales_query
        .filter(Order.status != "Cancelled")
        .scalar()
        or 0
    )

    active_menu_items = MenuItem.query.filter_by(is_active=True).count()
    active_deals = Deal.query.filter_by(is_active=True).count()
    active_users = User.query.filter_by(is_active=True).count()

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
            "active_users": active_users,
            "date": request.args.get("date"),
            "start_date": request.args.get("start_date"),
            "end_date": request.args.get("end_date")
        }
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
    status_summary = {}
    order_type_summary = {}

    for order in orders:
        payment_mode = order.payment_mode or "Unknown"
        status = order.status or "Unknown"
        order_type = order.order_type or "Unknown"

        payment_summary[payment_mode] = (
            payment_summary.get(payment_mode, 0) + order.total_amount
        )

        status_summary[status] = status_summary.get(status, 0) + 1
        order_type_summary[order_type] = order_type_summary.get(order_type, 0) + 1

    return jsonify({
        "success": True,
        "report": {
            "date": request.args.get("date"),
            "start_date": request.args.get("start_date"),
            "end_date": request.args.get("end_date"),
            "total_orders": len(orders),
            "gross_sales": gross_sales,
            "net_sales": net_sales,
            "payment_summary": payment_summary,
            "status_summary": status_summary,
            "order_type_summary": order_type_summary,
            "orders": [order.to_dict() for order in orders]
        }
    })


# ======================================================
# ORDERS
# ======================================================

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
        "date": request.args.get("date"),
        "start_date": request.args.get("start_date"),
        "end_date": request.args.get("end_date")
    })


@admin_bp.route("/orders/<int:order_id>/status", methods=["PATCH"])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json() or {}

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


# ======================================================
# USERS
# ======================================================

@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.order_by(User.id.desc()).all()

    return jsonify({
        "success": True,
        "users": [user.to_dict() for user in users]
    })


@admin_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)

    return jsonify({
        "success": True,
        "user": user.to_dict()
    })


@admin_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")

    if not username:
        return jsonify({
            "success": False,
            "message": "Username is required"
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "message": "Password is required"
        }), 400

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Username already exists"
        }), 409

    user = User(
        username=username,
        full_name=data.get("full_name"),
        email=data.get("email"),
        contact=data.get("contact"),
        role=data.get("role", "Order Taker"),
        assigned_branches=data.get("assigned_branches", "BROAST CHASERS"),
        default_branch=data.get("default_branch", "BROAST CHASERS"),
        discount_cap=int(data.get("discount_cap", 0)),
        wrap_categories=bool(data.get("wrap_categories", False)),
        tablet_user=bool(data.get("tablet_user", False)),
        show_category_first=bool(data.get("show_category_first", False)),
        show_service_charges_on_tablet=bool(
            data.get("show_service_charges_on_tablet", False)
        ),
        tax_verified=bool(data.get("tax_verified", False)),
        show_payment_section_on_tablet=bool(
            data.get("show_payment_section_on_tablet", False)
        ),
        pos_quick_service=bool(data.get("pos_quick_service", False)),
        quick_pos_quantity_selection=bool(
            data.get("quick_pos_quantity_selection", False)
        ),
        is_active=bool(data.get("is_active", True))
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User created successfully",
        "user": user.to_dict()
    }), 201


@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    username = data.get("username")

    if username and username != user.username:
        existing_user = User.query.filter_by(username=username).first()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "Username already exists"
            }), 409

        user.username = username

    user.full_name = data.get("full_name", user.full_name)
    user.email = data.get("email", user.email)
    user.contact = data.get("contact", user.contact)
    user.role = data.get("role", user.role)

    user.assigned_branches = data.get(
        "assigned_branches",
        user.assigned_branches
    )

    user.default_branch = data.get(
        "default_branch",
        user.default_branch
    )

    if "discount_cap" in data:
        user.discount_cap = int(data.get("discount_cap", 0))

    boolean_fields = [
        "wrap_categories",
        "tablet_user",
        "show_category_first",
        "show_service_charges_on_tablet",
        "tax_verified",
        "show_payment_section_on_tablet",
        "pos_quick_service",
        "quick_pos_quantity_selection",
        "is_active"
    ]

    for field in boolean_fields:
        if field in data:
            setattr(user, field, bool(data[field]))

    if data.get("password"):
        user.set_password(data["password"])

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User updated successfully",
        "user": user.to_dict()
    })


@admin_bp.route("/users/<int:user_id>/toggle", methods=["PATCH"])
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)

    if user.username == "admin":
        return jsonify({
            "success": False,
            "message": "Default admin user cannot be disabled"
        }), 400

    user.is_active = not user.is_active
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User status updated successfully",
        "user": user.to_dict()
    })


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)

    if user.username == "admin":
        return jsonify({
            "success": False,
            "message": "Default admin user cannot be deleted"
        }), 400

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User deleted successfully"
    })