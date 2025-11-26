import csv
from datetime import datetime
import time
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

from db.database import SessionLocal, engine
from db import models


PRODUCTS_CSV = "/app/data/products_list.csv"
PURCHASES_CSV = "/app/data/purchases.csv"

def wait_for_db(max_retries: int = 20, delay_seconds: int = 1) -> None:
    """Wait until Postgres accepts connections."""
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✔ DB is ready")
            return
        except OperationalError:
            print(f"DB not ready yet (attempt {attempt}/{max_retries})...")
            time.sleep(delay_seconds)
    raise RuntimeError("DB was not ready after waiting")


def load_products(db: Session) -> None:
    with open(PRODUCTS_CSV, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row["product_name"]
            unit_price = float(row["unit_price"])
            product = models.Product(name=name, unit_price=unit_price)
            db.add(product)

    db.commit()
    print("✔ Loaded products from products_list.csv")


def load_purchases(db: Session) -> None:
    with open(PURCHASES_CSV, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            supermarket_id = row["supermarket_id"]
            timestamp = datetime.fromisoformat(row["timestamp"])
            customer_id = row["user_id"]
            items_list = row["items_list"]
            total_amount = float(row["total_amount"])

            supermarket = db.get(models.Supermarket, supermarket_id)
            if not supermarket:
                supermarket = models.Supermarket(
                    id=supermarket_id,
                    name=f"Shefa Isaschar No. {supermarket_id[-1]}",
                )
                db.add(supermarket)

            customer = db.get(models.Customer, customer_id)
            if not customer:
                customer = models.Customer(id=customer_id)
                db.add(customer)

            purchase = models.Purchase(
                supermarket_id=supermarket_id,
                customer_id=customer_id,
                timestamp=timestamp,
                total_amount=total_amount,
            )
            db.add(purchase)
            db.flush()

            # Create purchase items
            item_names = [x.strip() for x in items_list.split(",") if x.strip()]
            for product_name in item_names:
                product = db.get(models.Product, product_name)
                if not product:
                    raise ValueError(
                        f"Product '{product_name}' from purchases.csv "
                        f"was not found in products table"
                    )
                db.add(
                    models.PurchaseItem(
                        purchase_id=purchase.id,
                        product_name=product_name,
                    )
                )

        db.commit()

    print("✔ Loaded purchases, supermarkets and customers from purchases.csv")


def main() -> None:
    print("Starting DB load...")
    wait_for_db()
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        load_products(db)
        load_purchases(db)
    finally:
        db.close()
    print("DB load finished.")


if __name__ == "__main__":
    main()
