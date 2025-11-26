import { getProducts, getSupermarkets, createPurchase, getCustomers } from "../api/cash";
import { ProductsList } from "./ProductsList";
import type { Supermarket, Product, Purchase, Customer } from "../types";


export async function PurchaseForm(root: HTMLElement): Promise<void> {
  root.innerHTML = `
    <h2>Cash Register</h2>
    <p class="card-description">
      Fill in a new purchase: choose a branch, select new or existing customer,
      and tick the products the customer is buying.
    </p>

    <div>
      <div class="section-title">Step 1 · Choose branch</div>
      <label>
        Branch:
        <select id="sm"></select>
      </label>
    </div>

    <div style="margin-top: 12px;">
      <div class="section-title">Step 2 · Customer</div>
      <div class="radio-group">
        <label>
          <input type="radio" name="c" value="new" checked />
          New customer (no card yet)
        </label>
        <label>
          <input type="radio" name="c" value="existing" />
          Existing customer (has card ID)
        </label>
      </div>

      <label class="customer-row" style="margin-top: 6px;">
        <span>Customer card / ID:</span>
        <div class="customer-select-wrapper">
          <input
            id="customer-id"
            type="text"
            placeholder=""
            disabled
            autocomplete="off"
          />
          <div id="customer-dropdown" class="customer-dropdown hidden"></div>
        </div>
      </label>

      <p class="small-muted" style="margin-top:4px;">
        For a new customer, leave this empty and the system will create a new ID.
        For an existing customer, start typing and choose from the known customers.
      </p>
    </div>

    <div style="margin-top: 12px;">
      <div class="section-title">Step 3 · Products</div>
      <p class="small-muted" style="margin-top:0;">
        Tick each product the customer is buying. You can select each product at most once.
      </p>
      <div id="products"></div>
    </div>

    <div class="cash-actions">
      <button id="submit">
        Save purchase
      </button>
    </div>

    <div id="status" class="status"></div>

    <!-- kept for debugging but hidden -->
    <pre id="result" style="display:none;"></pre>
  `;

  const supermarketSelect = root.querySelector<HTMLSelectElement>("#sm");
  const productDiv = root.querySelector<HTMLDivElement>("#products");
  const statusDiv = root.querySelector<HTMLDivElement>("#status");
  const resultPre = root.querySelector<HTMLPreElement>("#result");
  const customerMode = root.querySelectorAll<HTMLInputElement>("input[name='c']");
  const customerId = root.querySelector<HTMLInputElement>("#customer-id");
  const customerDropdown = root.querySelector<HTMLDivElement>("#customer-dropdown");
  const submitBtn = root.querySelector<HTMLButtonElement>("#submit");

  if (
    !supermarketSelect ||
    !productDiv ||
    !statusDiv ||
    !resultPre ||
    !customerId ||
    !customerDropdown ||
    !submitBtn
  ) {
    throw new Error("Expected elements not found in PurchaseForm root");
  }

  function setStatus(message: string, type: "success" | "error" | "info") {
    if (!statusDiv) return;
    statusDiv.textContent = message;
    if (statusDiv) statusDiv.className = `status ${type}`;
  }

  // ---------------- Customer mode toggle ----------------
  customerMode.forEach((r) => {
    r.addEventListener("change", () => {
      if (r.checked && r.value === "existing") {
        customerId.disabled = false;
        customerId.placeholder = "Start typing to search existing customers";
      } else if (r.checked && r.value === "new") {
        customerId.disabled = true;
        customerId.value = "";
        customerId.placeholder = "";
        customerDropdown.classList.add("hidden");
      }
    });
  });

  setStatus("Loading branches and products...", "info");

  // ---------------- Load supermarkets ----------------
  try {
    const supermarkets: Supermarket[] = await getSupermarkets();
    supermarketSelect.innerHTML = `<option value="">Select branch...</option>`;
    supermarkets.forEach((s) =>
      supermarketSelect.append(new Option(`${s.name}`, s.id))
    );
  } catch (e) {
    console.error("Error loading supermarkets:", e);
    setStatus("Could not load branches. Please refresh the page.", "error");
  }

  // ---------------- Load customers (for search) ----------------
  type CustomerItem = { id: string; label: string };
  let customersCache: CustomerItem[] = [];

  try {
    const customers: Customer[] = await getCustomers();
    customersCache = customers.map((c) => {
      const id = (c as any).customer_id ?? c.id;
      const name = (c as any).name ?? "";
      const label = name ? `${id} – ${name}` : id;
      return { id, label };
    });
  } catch (e) {
    console.error("Error loading customers:", e);
  }

  // Small, scrollable dropdown with search
  customerId.addEventListener("input", () => {
    const term = customerId.value.trim().toLowerCase();

    if (!term) {
      customerDropdown.classList.add("hidden");
      customerDropdown.innerHTML = "";
      return;
    }

    const filtered = customersCache.filter(
      (c) =>
        c.id.toLowerCase().includes(term) ||
        c.label.toLowerCase().includes(term)
    );

    if (!filtered.length) {
      customerDropdown.classList.add("hidden");
      customerDropdown.innerHTML = "";
      return;
    }

    customerDropdown.innerHTML = "";

    filtered.forEach((c) => {
      const item = document.createElement("div");
      item.className = "customer-option";
      item.textContent = c.label;
      item.onclick = () => {
        customerId.value = c.id;
        customerDropdown.classList.add("hidden");
      };
      customerDropdown.appendChild(item);
    });

    customerDropdown.classList.remove("hidden");
  });

  // Hide dropdown when clicking outside the cash-register card
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target as Node)) {
      customerDropdown.classList.add("hidden");
    }
  });

  // ---------------- Load products ----------------
  try {
    const products: Product[] = await getProducts();
    productDiv.innerHTML = `<div class="products-grid" id="products-grid"></div>`;
    const grid = productDiv.querySelector<HTMLDivElement>("#products-grid");
    if (!grid) throw new Error("Missing products grid");
    ProductsList(products, grid);

    setStatus("Please fill in the purchase and click 'Save purchase'.", "success");
  } catch (e) {
    console.error("Error loading products:", e);
    productDiv.textContent = "Could not load products.";
    setStatus("Could not load products. Please refresh the page.", "error");
  }

  // ---------------- Submit handler ----------------
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    void (async () => {
      if (!supermarketSelect.value) {
        setStatus("Please choose a branch.", "error");
        return;
      }

      const grid = productDiv.querySelector<HTMLDivElement>("#products-grid");
      if (!grid) {
        setStatus("Products are not loaded yet.", "error");
        return;
      }

      const selectedProducts = Array.from(
        grid.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked")
      ).map((cb) => cb.value);

      if (selectedProducts.length === 0) {
        setStatus("Please select at least one product.", "error");
        return;
      }

      const mode = Array.from(customerMode).find((r) => r.checked)?.value;
      const payload: { supermarket_id: string; items: string[]; customer_id?: string } = {
        supermarket_id: supermarketSelect.value,
        items: selectedProducts,
      };

      if (mode === "existing") {
        const val = customerId.value.trim();
        if (!val) {
          setStatus("Please type/select the customer's ID.", "error");
          return;
        }
        payload.customer_id = val;
      }

      submitBtn.disabled = true;
      setStatus("Saving purchase...", "info");

      try {
        const data = (await createPurchase(payload)) as Purchase;
        const total = data.total_amount?.toFixed(2) ?? "";
        const itemsCount = data.items?.length ?? 0;

        resultPre.textContent = JSON.stringify(data, null, 2);

        setStatus(
          `✓ Purchase saved successfully. Customer ID: ${
            data.customer_id
          }, total: ${total}, products: ${itemsCount}.`,
          "success"
        );
      } catch (e) {
        console.error(e);
        setStatus("Unexpected error saving purchase.", "error");
        resultPre.textContent = String(e);
      } finally {
        submitBtn.disabled = false;
      }
    })();
  });
}
