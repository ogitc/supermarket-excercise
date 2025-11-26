import { getTopProducts } from "../../api/analytics";
import type { TopProduct } from "../../types";


export async function renderTopProducts(
  container: HTMLElement
): Promise<void> {
  const data: TopProduct[] = await getTopProducts();

  if (data.length === 0) {
    container.textContent = "No product sales yet.";
    return;
  }

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  ["Product", "Unit price", "Times sold"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach((row) => {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    tdName.textContent = row.product_name;
    const tdPrice = document.createElement("td");
    tdPrice.textContent = row.unit_price.toFixed(2);
    const tdCount = document.createElement("td");
    tdCount.textContent = row.times_sold.toString();
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCount);
    table.appendChild(tr);
  });

  container.innerHTML = "";
  container.appendChild(table);
}
