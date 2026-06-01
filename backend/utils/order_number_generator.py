from datetime import datetime


def generate_order_number(order_id):
    today = datetime.now().strftime("%Y%m%d")
    return f"ORD-{today}-{order_id:03d}"