from models.menu_model import MenuItem
from models.deal_model import Deal


def seed_database(db):
    if MenuItem.query.count() == 0:
        menu_items = [
            MenuItem(
                name="Quarter Broast",
                category="Broast",
                description="1 Leg, 1 Thigh, 1 Dip and 1 Bun served with Fries",
                price=750,
                is_active=True
            ),
            MenuItem(
                name="Half Broast",
                category="Broast",
                description="2 Legs, 2 Thighs, 2 Dips and 1 Bun served with Fries",
                price=1299,
                is_active=True
            ),
            MenuItem(
                name="Full Broast",
                category="Broast",
                description="4 Legs, 4 Thighs, 3 Dips and 2 Buns served with Fries",
                price=2480,
                is_active=True
            ),
            MenuItem(
                name="Zinger Burger",
                category="Burger",
                description="Thigh piece, bun, burger sauce and iceberg, served with Fries",
                price=500,
                is_active=True
            ),
            MenuItem(
                name="Injected Zinger Burger",
                category="Burger",
                description="Thigh piece injected with spicy sauce, bun, burger sauce and iceberg, served with Fries",
                price=600,
                is_active=True
            ),
            MenuItem(
                name="Crunch Blast Burger",
                category="Burger",
                description="Crispy chicken injected with spicy sauce, bun, burger sauce and iceberg, served with Fries",
                price=600,
                is_active=True
            ),
            MenuItem(
                name="Mighty Zinger Burger",
                category="Burger",
                description="2 thigh pieces, bun, burger sauce and iceberg, served with Fries",
                price=750,
                is_active=True
            ),
            MenuItem(
                name="Tikka Sandwich",
                category="Sandwich",
                description="3 Bread Slice, Tikka Chicken, Vegetable, Sandwich Sauce, served with Fries",
                price=500,
                is_active=True
            ),
            MenuItem(
                name="club Sandwich",
                category="Sandwich",
                description="4 Bread Slice, Tikka Chicken, Egg, Vegetable, Sandwich Sauce, served with Fries",
                price=500,
                is_active=True
            ),
            MenuItem(
                name="Tikka Pizza (Small)",
                category="Pizza",
                description="Tikka Chicken, Vegetable, Pizza Sauce",
                price=550,
                is_active=True
            ),
            MenuItem(
                name="Tikka Pizza (Medium)",
                category="Pizza",
                description="Tikka Chicken, Vegetable, Pizza Sauce",
                price=1050,
                is_active=True
            ),
            MenuItem(
                name="Tikka Pizza (Large)",
                category="Pizza",
                description="Tikka Chicken, Vegetable, Pizza Sauce",
                price=1450,
                is_active=True
            ),
            MenuItem(
                name="Supreme Pizza (Small)",
                category="Pizza",
                description="Supreme Chicken, Vegetable, Pizza Sauce",
                price=600,
                is_active=True
            ),
            MenuItem(
                name="Supreme Pizza (Medium)",
                category="Pizza",
                description="Supreme Chicken, Vegetable, Pizza Sauce",
                price=1150,
                is_active=True
            ),
            MenuItem(
                name="Supreme Pizza (Large)",
                category="Pizza",
                description="Supreme Chicken, Vegetable, Pizza Sauce",
                price=1550,
                is_active=True
            ),                                                           
            MenuItem(
                name="Malai Boti Pizza (Small)",
                category="Pizza",
                description="Malai Boti Chicken, Vegetable, Pizza Sauce",
                price=600,
                is_active=True
            ),
            MenuItem(
                name="Malai Boti Pizza (Medium)",
                category="Pizza",
                description="Malai Boti Chicken, Vegetable, Pizza Sauce",
                price=1150,
                is_active=True
            ),
            MenuItem(
                name="Malai Boti Pizza (Large)",
                category="Pizza",
                description="Malai Boti Chicken, Vegetable, Pizza Sauce",
                price=1550,
                is_active=True
            ),                                                           
            MenuItem(
                name="Zinger Wrap",
                category="Wrap",
                description="Tortilla Bread, Chicken, Vegetable, Sauce, served with Fries",
                price=550,
                is_active=True
            ),
            MenuItem(
                name="Special Wrap",
                category="Wrap",
                description="Tortilla Bread, Chicken, Vegetable, Sauce, served with Fries",
                price=650,
                is_active=True
            ),
            MenuItem(
                name="Chasers Special Wrap",
                category="Wrap",
                description="Tortilla Bread, Chicken, Vegetable, Sauce, served with Fries",
                price=800,
                is_active=True
            ),

            MenuItem(
                name="Fries (Half)",
                category="Fries",
                description="Plain Fries",
                price=300,
                is_active=True
            ),
            MenuItem(
                name="Fries (Full)",
                category="Fries",
                description="Plain Fries",
                price=400,
                is_active=True
            ),
            MenuItem(
                name="Masla Fries (Half)",
                category="Fries",
                description="Masla Fries",
                price=350,
                is_active=True
            ),
            MenuItem(
                name="Masla Fries (Full)",
                category="Fries",
                description="Masla Fries",
                price=450,
                is_active=True
            ),
            MenuItem(
                name="Loaded Fries (Half)",
                category="Fries",
                description="Plain Fries, Chicken, Sauce, Vegetable",
                price=550,
                is_active=True
            ),
            MenuItem(
                name="Loaded Fries (Full)",
                category="Fries",
                description="Plain Fries, Chicken, Sauce, Vegetable",
                price=750,
                is_active=True
            ), 
            MenuItem(
                name="Strips (5 Pieces)",
                category="Sides",
                description="Chicken Strips",
                price=550,
                is_active=True
            ),
            MenuItem(
                name="Nuggets (10 pieces)",
                category="Sides",
                description="Nuggets",
                price=500,
                is_active=True
            )
        ]

        db.session.add_all(menu_items)

    if Deal.query.count() == 0:
        deals = [
            Deal(
                name="Spicy Single",
                items_description="1 Quarter Broast + Fries + Drink (345 ml)",
                price=850,
                is_active=True
            ),
            Deal(
                name="Spicy Double",
                items_description="1 half Broast + Fries + Drink (500 ml)",
                price=1499,
                is_active=True
            ),
            Deal(
                name="4 * 4",
                items_description="1 Full + Fries + Drink (1500 ml)",
                price=2600,
                is_active=True
            ),                        
            Deal(
                name="Family Deal",
                items_description="2 Full Broast + Fries + 2  Drinks (1500 ml)",
                price=4600,
                is_active=True
            ),

            Deal(
                name="Deal 2S",
                items_description="2 Small Pizzas + 2  Drinks (345 ml)",
                price=950,
                is_active=True
            ),
            Deal(
                name="=Deal 2M",
                items_description="2 Medium Pizzas + 2  Drinks (345 ml)",
                price=1600,
                is_active=True
            ),            
            Deal(
                name="Deal 2L",
                items_description="2 Large Pizzas + Drink (1500 ml)",
                price=2300,
                is_active=True
            ),

            Deal(
                name="Zinger Deal",
                items_description="4 Zinger Burgers",
                price=1000,
                is_active=True
            )
        ]

        db.session.add_all(deals)

    db.session.commit()