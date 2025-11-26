export interface Product {
    name: string;
    unit_price: number;
  }
  
  export interface Supermarket {
    id: string;
    name: string;
  }
  
  export interface PurchaseItem {
    product_name: string;
  }
  
  export interface Purchase {
    id: number;
    supermarket_id: string;
    customer_id: string;
    timestamp: string;
    total_amount: number;
    items: PurchaseItem[];
  }
  
  export interface UniqueCustomersResponse {
    unique_customers: number;
  }
  
  export interface LoyalCustomer {
    customer_id: string;
    purchase_count: number;
  }
  
  export interface TopProduct {
    product_name: string;
    unit_price: number;
    times_sold: number;
  }
  
  export interface Customer {
    id: string;
}
  