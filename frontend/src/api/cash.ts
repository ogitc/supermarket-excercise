import type { Supermarket, Product, Purchase, Customer } from "../types";


const BASE_URL = "http://localhost:8001/cash-register";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export async function getSupermarkets(): Promise<Supermarket[]> {
  const res = await fetch(`${BASE_URL}/supermarkets`);
  if (!res.ok) {
    throw new Error("Failed to fetch supermarkets");
  }
  return res.json();
}

interface PurchasePayload {
  supermarket_id: string;
  items: string[];
  customer_id?: string;
}

export async function createPurchase(
  payload: PurchasePayload
): Promise<Purchase | any> {
  const res = await fetch(`${BASE_URL}/purchases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data;
}

export async function getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) {
      throw new Error("Failed to fetch customers");
    }
    return res.json();
  }
  