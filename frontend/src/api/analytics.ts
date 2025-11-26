import type {
    UniqueCustomersResponse,
    LoyalCustomer,
    TopProduct,
  } from "../types";
  
  
  const BASE_URL = "http://localhost:8002/analytics";
  
  export async function getUniqueCustomers(): Promise<UniqueCustomersResponse> {
    const res = await fetch(`${BASE_URL}/unique-customers`);
    if (!res.ok) throw new Error("Failed to fetch unique customers");
    return res.json();
  }
  
  export async function getLoyalCustomers(): Promise<LoyalCustomer[]> {
    const res = await fetch(`${BASE_URL}/loyal-customers`);
    if (!res.ok) throw new Error("Failed to fetch loyal customers");
    return res.json();
  }
  
  export async function getTopProducts(): Promise<TopProduct[]> {
    const res = await fetch(`${BASE_URL}/top-products`);
    if (!res.ok) throw new Error("Failed to fetch top products");
    return res.json();
  }
  