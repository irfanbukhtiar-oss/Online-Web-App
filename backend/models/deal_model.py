from database import db


class Deal(db.Model):
    __tablename__ = "deals"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False)
    items_description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Integer, nullable=False)

    image_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    def to_dict(self):
        return {
            "id": self.id,
            "type": "deal",
            "name": self.name,
            "items_description": self.items_description,
            "price": self.price,
            "image_url": self.image_url,
            "is_active": self.is_active
        }