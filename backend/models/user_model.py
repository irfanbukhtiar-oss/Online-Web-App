from werkzeug.security import generate_password_hash, check_password_hash
from database import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    full_name = db.Column(db.String(150), nullable=True)
    email = db.Column(db.String(150), nullable=True)
    contact = db.Column(db.String(50), nullable=True)

    role = db.Column(db.String(50), default="Order Taker")
    assigned_branches = db.Column(db.String(255), default="BROAST CHASERS")
    default_branch = db.Column(db.String(150), default="BROAST CHASERS")

    discount_cap = db.Column(db.Integer, default=0)

    wrap_categories = db.Column(db.Boolean, default=False)
    tablet_user = db.Column(db.Boolean, default=False)
    show_category_first = db.Column(db.Boolean, default=False)
    show_service_charges_on_tablet = db.Column(db.Boolean, default=False)
    tax_verified = db.Column(db.Boolean, default=False)
    show_payment_section_on_tablet = db.Column(db.Boolean, default=False)
    pos_quick_service = db.Column(db.Boolean, default=False)
    quick_pos_quantity_selection = db.Column(db.Boolean, default=False)

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def set_password(self, password):
        if password:
            self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "contact": self.contact,
            "role": self.role,
            "assigned_branches": self.assigned_branches,
            "default_branch": self.default_branch,
            "discount_cap": self.discount_cap,
            "wrap_categories": self.wrap_categories,
            "tablet_user": self.tablet_user,
            "show_category_first": self.show_category_first,
            "show_service_charges_on_tablet": self.show_service_charges_on_tablet,
            "tax_verified": self.tax_verified,
            "show_payment_section_on_tablet": self.show_payment_section_on_tablet,
            "pos_quick_service": self.pos_quick_service,
            "quick_pos_quantity_selection": self.quick_pos_quantity_selection,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }