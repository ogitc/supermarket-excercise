import { getLoyalCustomers } from "../../api/analytics";
import type { LoyalCustomer } from "../../types";


const LOYAL_PAGE_SIZE = 10;

export async function renderLoyalCustomers(
  container: HTMLElement
): Promise<void> {
  const data: LoyalCustomer[] = await getLoyalCustomers();

  if (data.length === 0) {
    container.textContent =
      "No loyal customers yet (no one bought 3 times or more).";
    return;
  }

  let currentPage = 0;
  const totalPages = Math.ceil(data.length / LOYAL_PAGE_SIZE);

  const renderPage = () => {
    const start = currentPage * LOYAL_PAGE_SIZE;
    const end = Math.min(start + LOYAL_PAGE_SIZE, data.length);
    const pageItems = data.slice(start, end);

    // Build table
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    ["Customer ID", "Number of purchases"].forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    pageItems.forEach((row) => {
      const tr = document.createElement("tr");
      const tdId = document.createElement("td");
      tdId.textContent = row.customer_id;
      const tdCount = document.createElement("td");
      tdCount.textContent = row.purchase_count.toString();
      tr.appendChild(tdId);
      tr.appendChild(tdCount);
      table.appendChild(tr);
    });

    container.innerHTML = "";
    container.appendChild(table);

    // Pagination controls
    const pager = document.createElement("div");
    pager.style.display = "flex";
    pager.style.justifyContent = "space-between";
    pager.style.alignItems = "center";
    pager.style.marginTop = "8px";

    const info = document.createElement("span");
    info.className = "small-muted";
    info.textContent = `Showing ${start + 1}–${end} of ${
      data.length
    } customers (page ${currentPage + 1} of ${totalPages})`;

    pager.appendChild(info);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "6px";

    // FIRST button
    const firstBtn = document.createElement("button");
    firstBtn.textContent = "First";
    firstBtn.className = "secondary";
    firstBtn.disabled = currentPage === 0;
    firstBtn.onclick = () => {
      currentPage = 0;
      renderPage();
    };

    // PREVIOUS button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.className = "secondary";
    prevBtn.disabled = currentPage === 0;
    prevBtn.onclick = () => {
      if (currentPage > 0) {
        currentPage -= 1;
        renderPage();
      }
    };

    // NEXT button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.className = "secondary";
    nextBtn.disabled = currentPage >= totalPages - 1;
    nextBtn.onclick = () => {
      if (currentPage < totalPages - 1) {
        currentPage += 1;
        renderPage();
      }
    };

    // LAST button
    const lastBtn = document.createElement("button");
    lastBtn.textContent = "Last";
    lastBtn.className = "secondary";
    lastBtn.disabled = currentPage >= totalPages - 1;
    lastBtn.onclick = () => {
      currentPage = totalPages - 1;
      renderPage();
    };

    // Append buttons
    buttonsContainer.appendChild(firstBtn);
    buttonsContainer.appendChild(prevBtn);
    buttonsContainer.appendChild(nextBtn);
    buttonsContainer.appendChild(lastBtn);

    pager.appendChild(buttonsContainer);

    container.appendChild(pager);
  };

  renderPage();
}
