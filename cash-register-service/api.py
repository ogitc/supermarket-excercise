from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from db.database import get_db
from db import models
from schemas import CustomerOut, ProductOut, SupermarketOut, PurchaseOut, PurchaseCreate


router = APIRouter(prefix="/cash-register", tags=["Cash Register"])

@router.get("/customers", response_model=list[CustomerOut])
def list_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).order_by(models.Customer.id).all()


@router.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.name).all()


@router.get("/supermarkets", response_model=list[SupermarketOut])
def list_supermarkets(db: Session = Depends(get_db)):
    return db.query(models.Supermarket).order_by(models.Supermarket.id).all()


@router.post("/purchases", response_model=PurchaseOut, status_code=status.HTTP_201_CREATED)
def create_purchase(payload: PurchaseCreate, db: Session = Depends(get_db)):

    # Validate items
    if not payload.items:
        raise HTTPException(400, "Purchase must contain at least one product.")
    if len(set(payload.items)) != len(payload.items):
        raise HTTPException(400, "Each product can appear at most once.")

    # Validate supermarket
    supermarket = db.get(models.Supermarket, payload.supermarket_id)
    if not supermarket:
        raise HTTPException(400, f"Unknown supermarket_id '{payload.supermarket_id}'.")

    # Validate customer
    if payload.customer_id:
        customer = db.get(models.Customer, payload.customer_id)
        if not customer:
            raise HTTPException(400, f"Unknown customer_id '{payload.customer_id}'.")
        customer_id = customer.id
    else:
        customer_id = str(uuid.uuid4())
        db.add(models.Customer(id=customer_id))

    # Validate products
    products = (
        db.query(models.Product)
        .filter(models.Product.name.in_(payload.items))
        .all()
    )
    if len(products) != len(payload.items):
        found = {p.name for p in products}
        missing = [name for name in payload.items if name not in found]
        raise HTTPException(400, f"Products not found: {missing}")

    total_amount = sum(p.unit_price for p in products)
    ts = payload.timestamp or datetime.utcnow()
    purchase = models.Purchase(
        supermarket_id=payload.supermarket_id,
        customer_id=customer_id,
        timestamp=ts,
        total_amount=total_amount,
    )
    db.add(purchase)
    db.flush()

    for product in products:
        db.add(models.PurchaseItem(
            purchase_id=purchase.id,
            product_name=product.name
        ))

    db.commit()
    db.refresh(purchase)

    return purchase
