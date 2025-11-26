from pydantic import BaseModel
from typing import List


class UniqueCustomersOut(BaseModel):
    unique_customers: int


class LoyalCustomerOut(BaseModel):
    customer_id: str
    purchase_count: int


class TopProductOut(BaseModel):
    product_name: str
    unit_price: float
    times_sold: int
