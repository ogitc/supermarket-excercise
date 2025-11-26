export async function HomePage(root: HTMLElement): Promise<void> {
    root.innerHTML = `
      <div class="card">
        <h2>Welcome to Shefa Isaschar</h2>
        <p class="card-description">
          This system lets you simulate purchases at the cash register and see simple
          reports about your customers and best-selling products.
        </p>
  
        <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:flex-start; margin-top:16px;">
          <div style="flex:1; min-width:260px;">
            <p>
              Use the buttons at the top:
            </p>
            <ul style="padding-left:18px; font-size:14px;">
              <li><strong>Cash Register</strong> – register a new purchase in one of your branches.</li>
              <li><strong>Analytics</strong> – see how many customers you have, who are loyal customers,
                  and which products sell the most.</li>
            </ul>
            <p class="small-muted">
              This screen is only for explanation. You can always come back here by pressing the
              supermarket name at the top.
            </p>
          </div>
  
          <div style="flex:1; min-width:260px; text-align:center;">
            <img
              src="/src/assets/Shefa.png"
              alt="Supermarket illustration"
              style="max-width:100%; border-radius:12px; box-shadow:0 10px 25px rgba(15,23,42,0.15);"
            />
            <p class="small-muted" style="margin-top:6px;">
            </p>
          </div>
        </div>
      </div>
    `;
  }
  