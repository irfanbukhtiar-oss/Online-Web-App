import random


def generate_tracking_number():
    number = random.randint(100000, 999999)
    return f"TRK-{number}"