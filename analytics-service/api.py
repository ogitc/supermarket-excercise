from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from db.database import get_db
from db import models
from schemas import (
    UniqueCustomersOut,
    LoyalCustomerOut,
    TopProductOut,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/unique-customers", response_model=UniqueCustomersOut)
def get_unique_customers(db: Session = Depends(get_db)):
    """
    Total number of unique buyers in the network.
    We count distinct customers, using the customers table.
    """
    count = db.query(func.count(models.Customer.id)).scalar()
    return UniqueCustomersOut(unique_customers=count)


@router.get("/loyal-customers", response_model=list[LoyalCustomerOut])
def get_loyal_customers(db: Session = Depends(get_db)):
    """
    Loyal customers = customers who bought at least 3 times.
    We count purchases per customer across all branches.
    """
    rows = (
        db.query(
            models.Customer.id.label("customer_id"),
            func.count(models.Purchase.id).label("purchase_count"),
        )
        .join(models.Purchase, models.Customer.id == models.Purchase.customer_id)
        .group_by(models.Customer.id)
        .having(func.count(models.Purchase.id) >= 3)
        .order_by(func.count(models.Purchase.id).desc())
        .all()
    )

    return [
        LoyalCustomerOut(customer_id=row.customer_id, purchase_count=row.purchase_count)
        for row in rows
    ]


@router.get("/top-products", response_model=list[TopProductOut])
def get_top_products(db: Session = Depends(get_db)):
    """
    Top 3 most sold products of all time, by number of times they appear
    in purchase_items.

    If there is a tie for 3rd place, we return all products with the same count.
    """
    # Aggregate how many times each product was sold
    rows = (
        db.query(
            models.Product.name.label("product_name"),
            models.Product.unit_price.label("unit_price"),
            func.count(models.PurchaseItem.id).label("times_sold"),
        )
        .join(
            models.PurchaseItem,
            models.Product.name == models.PurchaseItem.product_name,
        )
        .group_by(models.Product.name, models.Product.unit_price)
        .order_by(func.count(models.PurchaseItem.id).desc(), models.Product.name)
        .all()
    )

    if not rows:
        return []

    # If <= 3 products total, just return all
    if len(rows) <= 3:
        top_rows = rows
    else:
        # threshold = times_sold value of the 3rd product
        third_count = rows[2].times_sold
        top_rows = [row for row in rows if row.times_sold >= third_count]

    return [
        TopProductOut(
            product_name=top_row.product_name,
            unit_price=top_row.unit_price,
            times_sold=top_row.times_sold,
        )
        for top_row in top_rows
    ]
