from flask import Blueprint, request, jsonify
from database import db
from models.deal_model import Deal

deal_bp = Blueprint("deal_bp", __name__)


@deal_bp.route("/", methods=["GET"])
def get_deals():
    deals = Deal.query.order_by(Deal.id.desc()).all()

    return jsonify({
        "success": True,
        "deals": [deal.to_dict() for deal in deals]
    })


@deal_bp.route("/active", methods=["GET"])
def get_active_deals():
    deals = Deal.query.filter_by(is_active=True).order_by(Deal.id.desc()).all()

    return jsonify({
        "success": True,
        "deals": [deal.to_dict() for deal in deals]
    })


@deal_bp.route("/", methods=["POST"])
def add_deal():
    data = request.get_json()

    required_fields = ["name", "items_description", "price"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "message": f"{field} is required"
            }), 400

    deal = Deal(
        name=data["name"],
        items_description=data["items_description"],
        price=int(data["price"]),
        image_url=data.get("image_url"),
        is_active=data.get("is_active", True)
    )

    db.session.add(deal)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Deal added successfully",
        "deal": deal.to_dict()
    }), 201


@deal_bp.route("/<int:deal_id>", methods=["PUT"])
def update_deal(deal_id):
    deal = Deal.query.get_or_404(deal_id)
    data = request.get_json()

    deal.name = data.get("name", deal.name)
    deal.items_description = data.get(
        "items_description",
        deal.items_description
    )
    deal.price = int(data.get("price", deal.price))
    deal.image_url = data.get("image_url", deal.image_url)

    if "is_active" in data:
        deal.is_active = data["is_active"]

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Deal updated successfully",
        "deal": deal.to_dict()
    })


@deal_bp.route("/<int:deal_id>/toggle", methods=["PATCH"])
def toggle_deal(deal_id):
    deal = Deal.query.get_or_404(deal_id)

    deal.is_active = not deal.is_active
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Deal status updated",
        "deal": deal.to_dict()
    })


@deal_bp.route("/<int:deal_id>", methods=["DELETE"])
def delete_deal(deal_id):
    deal = Deal.query.get_or_404(deal_id)

    db.session.delete(deal)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Deal deleted successfully"
    })