import { PurchaseForm } from "../components/PurchaseForm";


export async function CashRegisterPage(root: HTMLElement): Promise<void> {
  root.innerHTML = `<div class="card" id="cash-card"></div>`;
  const card = root.querySelector<HTMLDivElement>("#cash-card");
  if (!card) throw new Error("cash-card not found");
  await PurchaseForm(card);
}
