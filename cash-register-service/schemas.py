from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


#---------------- Customers ----------------
class CustomerOut(BaseModel):
    id: str

    class Config:
        orm_mode = True


#---------------- Products ----------------
class ProductOut(BaseModel):
    name: str
    unit_price: float

    class Config:
        orm_mode = True


#---------------- Supermarkets ----------------
class SupermarketOut(BaseModel):
    id: str
    name: str

    class Config:
        orm_mode = True


#---------------- Purchases ----------------
class PurchaseItemOut(BaseModel):
    product_name: str

    class Config:
        orm_mode = True


class PurchaseCreate(BaseModel):
    supermarket_id: str
    customer_id: Optional[str] = None
    items: List[str]
    timestamp: Optional[datetime] = None


class PurchaseOut(BaseModel):
    id: int
    supermarket_id: str
    customer_id: str
    timestamp: datetime
    total_amount: float
    items: List[PurchaseItemOut]

    class Config:
        orm_mode = True
