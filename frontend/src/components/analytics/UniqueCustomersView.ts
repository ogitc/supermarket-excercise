import { getUniqueCustomers } from "../../api/analytics";


export async function renderUniqueCustomers(
  container: HTMLElement
): Promise<void> {
  const data = await getUniqueCustomers();
  container.innerHTML = `
    <p>
      You currently have <strong>${data.unique_customers}</strong> unique customers
      in your network.
    </p>
  `;
}
