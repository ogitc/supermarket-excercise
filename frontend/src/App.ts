import { HomePage } from "./pages/HomePage";
import { CashRegisterPage } from "./pages/CashRegisterPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";


type Route = "home" | "cash" | "analytics";

function getRouteFromHash(): Route {
  const hash = window.location.hash;
  if (hash.startsWith("#/cash")) return "cash";
  if (hash.startsWith("#/analytics")) return "analytics";
  return "home";
}

async function renderRoute(route: Route): Promise<void> {
  const pageRoot = document.querySelector<HTMLDivElement>("#page-root");
  if (!pageRoot) throw new Error("#page-root not found");
  pageRoot.innerHTML = "";

  if (route === "home") {
    await HomePage(pageRoot);
  } else if (route === "cash") {
    await CashRegisterPage(pageRoot);
  } else if (route === "analytics") {
    await AnalyticsPage(pageRoot);
  }
}

export async function App(): Promise<void> {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) {
    throw new Error("Root element #app not found");
  }

  root.innerHTML = `
    <header style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:20px;
    ">
      <div
        id="brand-link"
        style="font-weight:700; font-size:20px; cursor:pointer; display:flex; align-items:center; gap:6px;"
      >
        🛒 Shefa Isaschar
      </div>
      <nav style="display:flex; gap:8px;">
        <button id="nav-cash" class="secondary">Cash Register</button>
        <button id="nav-analytics" class="secondary">Analytics</button>
      </nav>
    </header>

    <main id="page-root"></main>
  `;

  const brand = document.querySelector<HTMLDivElement>("#brand-link");
  const navCash = document.querySelector<HTMLButtonElement>("#nav-cash");
  const navAnalytics = document.querySelector<HTMLButtonElement>("#nav-analytics");

  if (!brand || !navCash || !navAnalytics) {
    throw new Error("Navbar elements not found");
  }

  brand.onclick = () => {
    window.location.hash = "#/"; // home
  };

  navCash.onclick = () => {
    window.location.hash = "#/cash";
  };

  navAnalytics.onclick = () => {
    window.location.hash = "#/analytics";
  };

  // react to hash changes
  window.addEventListener("hashchange", () => {
    const route = getRouteFromHash();
    void renderRoute(route);
  });

  // initial render
  const initialRoute = getRouteFromHash();
  await renderRoute(initialRoute);
}
