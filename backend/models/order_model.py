from database import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    order_number = db.Column(db.String(50), unique=True, nullable=False)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False)

    customer_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    address = db.Column(db.Text, nullable=True)

    order_type = db.Column(db.String(50), nullable=False)
    payment_mode = db.Column(db.String(50), nullable=False)
    qr_transaction_id = db.Column(db.String(100), nullable=True)

    special_note = db.Column(db.Text, nullable=True)

    total_amount = db.Column(db.Integer, nullable=False, default=0)

    status = db.Column(db.String(100), default="Pending Confirmation")

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "tracking_number": self.tracking_number,
            "customer_name": self.customer_name,
            "phone": self.phone,
            "address": self.address,
            "order_type": self.order_type,
            "payment_mode": self.payment_mode,
            "qr_transaction_id": self.qr_transaction_id,
            "special_note": self.special_note,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "items": [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    item_type = db.Column(db.String(50), nullable=False)
    item_id = db.Column(db.Integer, nullable=False)

    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    subtotal = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "item_type": self.item_type,
            "item_id": self.item_id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "subtotal": self.subtotal
        }