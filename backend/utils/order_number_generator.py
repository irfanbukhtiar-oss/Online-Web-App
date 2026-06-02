from datetime import datetime
import random


def generate_order_number():
    today = datetime.now().strftime("%Y%m%d")
    random_number = random.randint(1000, 9999)

    return f"ORD-{today}-{random_number}"