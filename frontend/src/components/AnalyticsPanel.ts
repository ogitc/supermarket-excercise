import { renderUniqueCustomers } from "./analytics/UniqueCustomersView";
import { renderLoyalCustomers } from "./analytics/LoyalCustomersView";
import { renderTopProducts } from "./analytics/TopProductsView";


type ReportKind = "unique" | "loyal" | "top";

export function AnalyticsPanel(root: HTMLElement): void {
    root.innerHTML = `
    <h2>Analytics</h2>
    <p class="card-description">
      Choose what you want to see. Only the selected report will be shown below.
    </p>

    <div class="analytics-buttons">
      <button id="btn-uc" class="secondary">Unique customers</button>
      <button id="btn-lc" class="secondary">Loyal customers</button>
      <button id="btn-tp" class="secondary">Top products</button>
    </div>

    <div id="analytics-result" class="analytics-section">
      <p class="small-muted">
        Click one of the buttons above to load a report.
      </p>
    </div>
  `;


  const ucBtn = root.querySelector<HTMLButtonElement>("#btn-uc");
  const lcBtn = root.querySelector<HTMLButtonElement>("#btn-lc");
  const tpBtn = root.querySelector<HTMLButtonElement>("#btn-tp");
  const result = root.querySelector<HTMLDivElement>("#analytics-result");

  if (!ucBtn || !lcBtn || !tpBtn || !result) {
    throw new Error("Expected elements not found in AnalyticsPanel root");
  }

  function setActive(button: HTMLButtonElement) {
    [ucBtn, lcBtn, tpBtn].forEach((b) => {
      if (b && b === button) b.classList.remove("secondary");
      else if (b) b.classList.add("secondary");
    });
  }

  function setResultHeader(title: string, description?: string) {
    if (!result) return;
    result.innerHTML = `
      <div class="section-title">${title}</div>
      ${
        description
          ? `<p class="small-muted" style="margin-top:0;">${description}</p>`
          : ""
      }
      <div id="analytics-content"></div>
    `;
  }

  function getContentDiv(): HTMLDivElement {
    const content = result?.querySelector<HTMLDivElement>("#analytics-content");
    if (!content) throw new Error("#analytics-content not found");
    return content;
  }

  async function showReport(kind: ReportKind) {
    const content = getContentDiv();
    content.textContent = "Loading...";
    content.classList.remove("fade-in");
  
    try {
      if (kind === "unique") {
        await renderUniqueCustomers(content);
      } else if (kind === "loyal") {
        await renderLoyalCustomers(content);
      } else if (kind === "top") {
        await renderTopProducts(content);
      }
  
      void content.offsetWidth;
      content.classList.add("fade-in");
    } catch (err) {
      console.error(err);
      content.textContent = "Error loading report.";
    }
  }
  

  ucBtn.onclick = () => {
    setActive(ucBtn);
    setResultHeader(
      "Unique customers",
      "Total number of different customers who made at least one purchase."
    );
    void showReport("unique");
  };

  lcBtn.onclick = () => {
    setActive(lcBtn);
    setResultHeader(
      "Loyal customers",
      "Customers who bought at least 3 times in all your branches."
    );
    void showReport("loyal");
  };

  tpBtn.onclick = () => {
    setActive(tpBtn);
    setResultHeader(
      "Top products",
      "The best selling products of all time. If there is a tie, all top products are shown."
    );
    void showReport("top");
  };
}
