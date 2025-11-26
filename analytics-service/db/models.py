from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class Product(Base):
    __tablename__ = "products"

    name = Column(String, primary_key=True, index=True)
    unit_price = Column(Float, nullable=False)


class Supermarket(Base):
    __tablename__ = "supermarkets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    supermarket_id = Column(String, ForeignKey("supermarkets.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float, nullable=False)

    supermarket = relationship("Supermarket")
    customer = relationship("Customer")
    items = relationship(
        "PurchaseItem",
        back_populates="purchase",
        cascade="all, delete-orphan",
    )


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)

    product_name = Column(String, ForeignKey("products.name"), nullable=False)

    purchase = relationship("Purchase", back_populates="items")
    product = relationship("Product")
