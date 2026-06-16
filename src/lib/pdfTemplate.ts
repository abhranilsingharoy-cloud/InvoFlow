import { InvoiceData } from "./validators";
import { formatCurrency, calculateTotals } from "./utils";
import { encode } from "html-entities";
import { format } from "date-fns";

export function generateInvoiceHTML(data: InvoiceData): string {
  const { subtotal, taxAmount, discountAmount, total } = calculateTotals(
    data.items,
    data.taxRate,
    data.discount
  );

  const safeStr = (str: string | undefined | null) => encode(str || "");
  const formattedIssueDate = data.issueDate ? format(new Date(data.issueDate), 'MMM dd, yyyy') : '';
  const formattedDueDate = data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${safeStr(data.invoiceNumber)}</title>
      <style>
        :root {
          --primary: #2563eb;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --bg-light: #f8fafc;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: var(--text-main);
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .logo {
          max-height: 80px;
          max-width: 200px;
          object-fit: contain;
        }
        .invoice-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          text-align: right;
          letter-spacing: -0.02em;
        }
        .invoice-number {
          font-size: 16px;
          color: var(--text-muted);
          text-align: right;
          margin-top: 4px;
        }
        .details-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .details-col {
          flex: 1;
        }
        .details-title {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .details-content {
          font-size: 14px;
        }
        .details-content strong {
          display: block;
          font-size: 16px;
          margin-bottom: 4px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: var(--bg-light);
          padding: 16px;
          border-radius: 8px;
        }
        .meta-item {
          font-size: 14px;
        }
        .meta-label {
          color: var(--text-muted);
          font-size: 12px;
        }
        .meta-value {
          font-weight: 600;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        th {
          text-align: left;
          padding: 12px;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 2px solid var(--border);
        }
        td {
          padding: 16px 12px;
          font-size: 14px;
          border-bottom: 1px solid var(--border);
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .totals-table {
          width: 300px;
          margin-bottom: 0;
        }
        .totals-table td {
          padding: 8px 12px;
          border-bottom: none;
        }
        .totals-table tr.total-row td {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary);
          border-top: 2px solid var(--border);
          padding-top: 16px;
        }
        .footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          font-size: 14px;
          color: var(--text-muted);
        }
        .footer-section {
          margin-bottom: 16px;
        }
        .footer-title {
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          ${data.logoUrl ? `<img src="${data.logoUrl}" class="logo" alt="Logo" />` : `<div style="height: 80px;"></div>`}
        </div>
        <div>
          <h1 class="invoice-title">INVOICE</h1>
          <div class="invoice-number">${safeStr(data.invoiceNumber)}</div>
        </div>
      </div>

      <div class="details-grid">
        <div class="details-col">
          <div class="details-title">From</div>
          <div class="details-content">
            <strong>${safeStr(data.senderName)}</strong>
            ${data.senderEmail ? `<div>${safeStr(data.senderEmail)}</div>` : ''}
            ${data.senderAddress ? `<div style="white-space: pre-wrap;">${safeStr(data.senderAddress)}</div>` : ''}
          </div>
        </div>
        
        <div class="details-col">
          <div class="details-title">To</div>
          <div class="details-content">
            <strong>${safeStr(data.clientName)}</strong>
            <div>${safeStr(data.clientEmail)}</div>
            ${data.clientAddress ? `<div style="white-space: pre-wrap;">${safeStr(data.clientAddress)}</div>` : ''}
          </div>
        </div>

        <div class="details-col" style="flex: 0.8;">
          <div class="meta-grid">
            <div class="meta-item">
              <div class="meta-label">Issue Date</div>
              <div class="meta-value">${formattedIssueDate}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Due Date</div>
              <div class="meta-value">${formattedDueDate}</div>
            </div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-center">Qty</th>
            <th class="text-right">Price</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${safeStr(item.description)}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.price, data.currency)}</td>
              <td class="text-right">${formatCurrency(item.quantity * item.price, data.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-container">
        <table class="totals-table">
          <tr>
            <td>Subtotal</td>
            <td class="text-right">${formatCurrency(subtotal, data.currency)}</td>
          </tr>
          ${data.discount > 0 ? `
          <tr>
            <td>Discount</td>
            <td class="text-right">-${formatCurrency(discountAmount, data.currency)}</td>
          </tr>
          ` : ''}
          ${data.taxRate > 0 ? `
          <tr>
            <td>Tax (${data.taxRate}%)</td>
            <td class="text-right">${formatCurrency(taxAmount, data.currency)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td>Total</td>
            <td class="text-right">${formatCurrency(total, data.currency)}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        ${data.notes ? `
        <div class="footer-section">
          <div class="footer-title">Notes</div>
          <div style="white-space: pre-wrap;">${safeStr(data.notes)}</div>
        </div>
        ` : ''}
        ${data.paymentTerms ? `
        <div class="footer-section">
          <div class="footer-title">Payment Terms</div>
          <div style="white-space: pre-wrap;">${safeStr(data.paymentTerms)}</div>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}
