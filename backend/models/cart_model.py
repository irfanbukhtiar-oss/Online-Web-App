class CartItem:
    def __init__(self, item_type, item_id, name, price, quantity):
        self.item_type = item_type
        self.item_id = item_id
        self.name = name
        self.price = price
        self.quantity = quantity

    def subtotal(self):
        return self.price * self.quantity

    def to_dict(self):
        return {
            "item_type": self.item_type,
            "item_id": self.item_id,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "subtotal": self.subtotal()
        }