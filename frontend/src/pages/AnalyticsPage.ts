import { AnalyticsPanel } from "../components/AnalyticsPanel";


export async function AnalyticsPage(root: HTMLElement): Promise<void> {
  root.innerHTML = `<div class="card" id="analytics-card"></div>`;
  const card = root.querySelector<HTMLDivElement>("#analytics-card");
  if (!card) throw new Error("analytics-card not found");
  AnalyticsPanel(card);
}
