// client/src/utils/invoiceHtml.js
// Build a full HTML document string with embedded print CSS.
// Use any HTTPS image URLs for logo/bg, or leave them blank.

const currency = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  });

export default function invoiceHtml(invoice, opts = {}) {
  const RED = "#A01414";
  const BLACK = "#0F0F10";
  const MID = "#3A3A3C";
  const LIGHT = "#F5F5F7";
  const BORDER = "1px solid rgba(0,0,0,.08)";

  const {
    logoUrl = "/logo.png", // place your logo in /public/logo.png or use a full URL
    bgUrl = "/invoice-bg.jpg", // place a subtle bg in /public/invoice-bg.jpg
    shop = invoice.shop || {
      name: "Impero Auto Body Repair",
      address: "1234 Dundas St W, Toronto, ON",
      phone: "(647) 555-0199",
      email: "info@imperoautobody.ca",
    },
    taxRate = invoice.taxRate ?? 0.13,
    invoiceTitle = "INVOICE",
  } = opts;

  const client = invoice.client || {};
  const vehicle = client.vehicle || invoice.vehicle || {};
  const lineItems = [...(invoice.items || [])];

  const subtotal =
    invoice.subtotal ??
    lineItems.reduce((sum, it) => sum + Number(it.price || it.cost || 0), 0);
  const tax = invoice.tax ?? subtotal * taxRate;
  const total = invoice.total ?? subtotal + tax;

  const invNumber =
    invoice.invoiceNumber || (invoice._id ? invoice._id.slice(-8) : "—");
  const invDate = new Date(invoice.date || Date.now()).toLocaleDateString();
  const status = (invoice.status || "Unpaid").toUpperCase();

  // HTML document:
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${invoiceTitle} ${invNumber}</title>
<style>
  :root{
    --red:${RED}; --black:${BLACK}; --mid:${MID}; --light:${LIGHT};
  }
  *{ box-sizing: border-box; }
  html,body{ margin:0; padding:0; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Arial,Helvetica,sans-serif; color: var(--mid); }
  .page{
    width: 210mm; min-height: 297mm; margin: 0 auto;
    background: #fff;
    background-image: linear-gradient(rgba(255,255,255,.92), rgba(255,255,255,.96)), url("${bgUrl}");
    background-size: cover; background-position: center;
    padding: 18mm 16mm;
  }
  .band-top{ height: 6px; background: linear-gradient(90deg, var(--black), var(--red)); }
  .band-bottom{ height: 6px; background: linear-gradient(90deg, var(--red), var(--black)); margin-top: 12mm; }
  .row{ display:flex; gap:12px; }
  .space-between{ justify-content: space-between; align-items: center; }
  .col{ display:flex; flex-direction:column; gap:8px; }
  .card{
    background:#fff; border:${BORDER}; border-radius:8px; padding:12px;
    box-shadow: 0 8px 24px rgba(0,0,0,.05);
  }
  .logo-box{ width: 28mm; height: 28mm; border:${BORDER}; border-radius:8px; display:grid; place-items:center; background:#fff; overflow:hidden;}
  .logo-box img{ width:100%; height:100%; object-fit:contain; }
  h1,h2,h3,h4{ margin:0; color: var(--black); }
  .title{ font-size: 20px; font-weight: 800; }
  .overline{ text-transform:uppercase; letter-spacing:1px; font-size:12px; color:#666; font-weight:700; }
  .pill{
    border:1px solid rgba(160,20,20,.3); padding:8px 12px; border-radius:10px; min-width:70mm; background:#fff;
  }
  .kv{ display:flex; justify-content:space-between; gap:12px; font-size:13px; }
  .kv b{ color: var(--black); }
  table{ border-collapse: collapse; width: 100%; }
  th,td{ border-bottom:${BORDER}; padding:10px 12px; font-size: 13px; }
  th{ background: var(--light); color: var(--black); text-align:left; }
  td.right, th.right{ text-align: right; }
  .totals .kv{ margin: 4px 0; }
  .total{ color: var(--red); font-weight:800; font-size:16px; }
  .mt{ margin-top: 12px; } .mb{ margin-bottom: 12px; }
  .page-break{ page-break-after: always; }
  @media print{
    @page{ size: A4; margin: 10mm; }
    body{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page{ width:auto; min-height:auto; padding:0; background-size:cover; }
    .card{ box-shadow:none; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="band-top"></div>

    <!-- Header -->
    <div class="row space-between mt">
      <div class="row" style="align-items:center; gap:12px;">
        <div class="logo-box">
          <img src="${logoUrl}" onerror="this.style.display='none'"/>
        </div>
        <div class="col">
          <div class="title">${shop.name}</div>
          <div style="font-size:13px; color:#555;">${shop.address}</div>
          <div style="font-size:13px; color:#555;">${shop.phone} • ${
    shop.email
  }</div>
        </div>
      </div>

      <div class="pill">
        <div class="overline">${invoiceTitle}</div>
        <div class="kv"><span>Invoice #</span><b>${invNumber}</b></div>
        <div class="kv"><span>Date</span><b>${invDate}</b></div>
        <div class="kv"><span>Status</span><b>${status}</b></div>
      </div>
    </div>

    <!-- Parties -->
    <div class="row mt">
      <div class="card" style="flex:1;">
        <div class="overline">Bill To</div>
        <div class="kv"><span>Client</span><b>${
          client.fullName || "—"
        }</b></div>
        <div class="kv"><span>Phone</span><b>${client.phone || "—"}</b></div>
        <div class="kv"><span>Plate</span><b>${
          client.plateNumber || "—"
        }</b></div>
      </div>
      <div class="card" style="flex:1;">
        <div class="overline">Vehicle</div>
        <div class="kv"><span>Make/Model</span><b>${vehicle.year || ""} ${
    vehicle.make || ""
  } ${vehicle.model || ""}</b></div>
        <div class="kv"><span>VIN</span><b>${vehicle.vin || "—"}</b></div>
      </div>
    </div>

    <!-- Items -->
    <div class="card mt">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="right" style="width:35mm;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${
            lineItems.length
              ? lineItems
                  .map(
                    (it) => `
            <tr>
              <td>
                <div style="font-weight:700; color:var(--black);">
                  ${sanitize(it.name || it.item || "Service")}
                </div>
                ${
                  typeof it.progress === "number"
                    ? `
                  <div style="font-size:12px; color:#666;">Progress: ${Number(
                    it.progress
                  )}% ${it.done ? "— Done" : ""}</div>
                `
                    : ""
                }
              </td>
              <td class="right">${currency(it.price ?? it.cost)}</td>
            </tr>
          `
                  )
                  .join("")
              : `
            <tr><td colspan="2" style="text-align:center; color:#666;">No items.</td></tr>
          `
          }
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="row mt">
      <div class="card" style="flex:1;">
        <div style="font-size:13px;">
          Thank you for choosing <b>${shop.name}</b>.<br/>
          All parts and labour are covered by our standard warranty.
        </div>
      </div>
      <div class="card totals" style="min-width:65mm;">
        <div class="kv"><span>Subtotal</span><b>${currency(subtotal)}</b></div>
        <div class="kv"><span>Tax (13%)</span><b>${currency(tax)}</b></div>
        <hr style="border:none; border-top:${BORDER}; margin:6px 0;" />
        <div class="kv"><span><b>Total</b></span><span class="total">${currency(
          total
        )}</span></div>
      </div>
    </div>

    <div class="band-bottom"></div>
  </div>
</body>
</html>`;
}

// small sanitizer to avoid breaking HTML
function sanitize(s) {
  return String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}
