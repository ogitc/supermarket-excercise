import type { Product } from "../types";


export function ProductsList(products: Product[], container: HTMLElement): void {
  container.innerHTML = "";

  products.forEach((product) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = product.name;

    label.appendChild(checkbox);
    label.appendChild(
      document.createTextNode(
        ` ${product.name} (${product.unit_price.toFixed(2)})`
      )
    );

    container.appendChild(label);
  });
}
