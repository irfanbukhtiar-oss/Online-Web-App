import os
from flask import Flask
from flask_cors import CORS

from config import Config
from database import db

from routes.auth_routes import auth_bp
from routes.menu_routes import menu_bp
from routes.deal_routes import deal_bp
from routes.order_routes import order_bp
from routes.tracking_routes import tracking_bp
from routes.admin_routes import admin_bp

from models.user_model import User
from models.menu_model import MenuItem
from models.deal_model import Deal
from models.order_model import Order, OrderItem


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    os.makedirs(os.path.join(os.path.dirname(__file__), "instance"), exist_ok=True)

    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(menu_bp, url_prefix="/api/menu")
    app.register_blueprint(deal_bp, url_prefix="/api/deals")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    app.register_blueprint(tracking_bp, url_prefix="/api/tracking")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/")
    def home():
        return {
            "message": "Online Ordering Backend Running",
            "status": "success"
        }

    with app.app_context():
        db.create_all()
        create_default_admin()
        seed_default_menu()
        seed_default_deals()

    return app


def create_default_admin():
    admin = User.query.filter_by(username="admin").first()

    if not admin:
        admin = User(
            username="admin",
            role="admin"
        )
        admin.set_password("admin123")

        db.session.add(admin)
        db.session.commit()


def seed_default_menu():
    if MenuItem.query.count() == 0:
        items = [
            MenuItem(
                name="Chicken Broast",
                category="Broast",
                price=650,
                description="Crispy chicken broast",
                is_active=True
            ),
            MenuItem(
                name="Zinger Burger",
                category="Burgers",
                price=450,
                description="Spicy crispy zinger burger",
                is_active=True
            ),
            MenuItem(
                name="Loaded Fries",
                category="Fries",
                price=350,
                description="Fries loaded with sauce and chicken",
                is_active=True
            )
        ]

        db.session.add_all(items)
        db.session.commit()


def seed_default_deals():
    if Deal.query.count() == 0:
        deals = [
            Deal(
                name="Deal 1",
                items_description="1 Chicken Broast + Fries + Drink",
                price=899,
                is_active=True
            ),
            Deal(
                name="Family Deal",
                items_description="4 Broast Pieces + 4 Drinks + Fries",
                price=2499,
                is_active=True
            )
        ]

        db.session.add_all(deals)
        db.session.commit()


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5001)