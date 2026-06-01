from flask import Blueprint, request, jsonify
from database import db
from models.menu_model import MenuItem

menu_bp = Blueprint("menu_bp", __name__)


@menu_bp.route("/", methods=["GET"])
def get_menu_items():
    items = MenuItem.query.order_by(MenuItem.category.asc()).all()

    return jsonify({
        "success": True,
        "items": [item.to_dict() for item in items]
    })


@menu_bp.route("/active", methods=["GET"])
def get_active_menu_items():
    items = MenuItem.query.filter_by(is_active=True).order_by(
        MenuItem.category.asc()
    ).all()

    return jsonify({
        "success": True,
        "items": [item.to_dict() for item in items]
    })


@menu_bp.route("/", methods=["POST"])
def add_menu_item():
    data = request.get_json()

    required_fields = ["name", "category", "price"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    item = MenuItem(
        name=data["name"],
        category=data["category"],
        price=int(data["price"]),
        description=data.get("description"),
        image_url=data.get("image_url"),
        is_active=data.get("is_active", True)
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Menu item added successfully",
        "item": item.to_dict()
    }), 201


@menu_bp.route("/<int:item_id>", methods=["PUT"])
def update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()

    item.name = data.get("name", item.name)
    item.category = data.get("category", item.category)
    item.price = int(data.get("price", item.price))
    item.description = data.get("description", item.description)
    item.image_url = data.get("image_url", item.image_url)

    if "is_active" in data:
        item.is_active = data["is_active"]

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Menu item updated successfully",
        "item": item.to_dict()
    })


@menu_bp.route("/<int:item_id>/toggle", methods=["PATCH"])
def toggle_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)

    item.is_active = not item.is_active
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Menu item status updated",
        "item": item.to_dict()
    })


@menu_bp.route("/<int:item_id>", methods=["DELETE"])
def delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Menu item deleted successfully"
    })