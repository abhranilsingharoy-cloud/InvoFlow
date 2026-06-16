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

  let cssVariables = '';
  let layoutClass = '';

  switch (data.templateStyle) {
    case 'bold':
      cssVariables = `
        --primary: #000000;
        --text-main: #111827;
        --border: #000000;
        --bg-light: #f3f4f6;
      `;
      layoutClass = 'style-bold';
      break;
    case 'classic':
      cssVariables = `
        --primary: #047857;
        --text-main: #374151;
        --border: #d1d5db;
        --bg-light: #f9fafb;
      `;
      layoutClass = 'style-classic';
      break;
    case 'modern':
      cssVariables = `
        --primary: #4f46e5;
        --text-main: #1e293b;
        --border: #cbd5e1;
        --bg-light: #f1f5f9;
      `;
      layoutClass = 'style-modern';
      break;
    case 'elegant':
      cssVariables = `
        --primary: #854d0e;
        --text-main: #1c1917;
        --border: #a8a29e;
        --bg-light: #fffbeb;
      `;
      layoutClass = 'style-elegant';
      break;
    case 'minimal':
    default:
      cssVariables = `
        --primary: #2563eb;
        --text-main: #0f172a;
        --text-muted: #64748b;
        --border: #e2e8f0;
        --bg-light: #f8fafc;
      `;
      layoutClass = 'style-minimal';
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${safeStr(data.invoiceNumber)}</title>
      <style>
        :root {
          ${cssVariables}
        }
        body {
          font-family: 'Inter', sans-serif;
          color: var(--text-main);
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .style-bold h1 { text-transform: uppercase; border-bottom: 4px solid var(--primary); padding-bottom: 8px; }
        .style-classic body { font-family: 'Times New Roman', serif; }
        .style-modern body { border-left: 16px solid var(--primary); }
        .style-modern .header { background: var(--bg-light); padding: 24px; border-radius: 8px; margin-bottom: 32px; }
        .style-elegant body { font-family: 'Georgia', serif; border: 8px double var(--primary); padding: 32px; margin: 8px; }
        .style-elegant .invoice-title { font-weight: normal; font-style: italic; text-align: center; }
        .style-elegant .header { flex-direction: column; align-items: center; text-align: center; }
        .style-elegant .text-right { text-align: center; }
        
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { max-height: 80px; max-width: 200px; object-fit: contain; }
        .invoice-title { font-size: 36px; font-weight: 700; color: var(--primary); margin: 0; text-align: right; }
        .details-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .details-col { flex: 1; }
        .details-title { font-size: 12px; text-transform: uppercase; color: var(--text-muted, #666); font-weight: 600; margin-bottom: 8px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: var(--bg-light); padding: 16px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid var(--border); }
        td { padding: 16px 12px; font-size: 14px; border-bottom: 1px solid var(--border); }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals-container { display: flex; justify-content: flex-end; margin-top: 24px; }
        .totals-table { width: 300px; }
        .totals-table td { padding: 8px 12px; border-bottom: none; }
        .totals-table tr.total-row td { font-size: 20px; font-weight: 700; color: var(--primary); border-top: 2px solid var(--border); }
        .footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--border); font-size: 14px; }
      </style>
    </head>
    <body class="${layoutClass}">
      <div class="header">
        <div>${data.logoUrl ? `<img src="${data.logoUrl}" class="logo" />` : ''}</div>
        <div>
          <h1 class="invoice-title">INVOICE</h1>
          <div class="text-right" style="margin-top: 4px;">${safeStr(data.invoiceNumber)}</div>
        </div>
      </div>

      <div class="details-grid">
        <div class="details-col">
          <div class="details-title">From</div>
          <strong>${safeStr(data.senderName)}</strong>
          ${data.senderEmail ? `<div>${safeStr(data.senderEmail)}</div>` : ''}
          ${data.senderAddress ? `<div>${safeStr(data.senderAddress)}</div>` : ''}
        </div>
        <div class="details-col">
          <div class="details-title">To</div>
          <strong>${safeStr(data.clientName)}</strong>
          <div>${safeStr(data.clientEmail)}</div>
          ${data.clientAddress ? `<div>${safeStr(data.clientAddress)}</div>` : ''}
        </div>
        <div class="details-col">
          <div class="meta-grid">
            <div><div class="details-title">Issue Date</div><div>${formattedIssueDate}</div></div>
            <div><div class="details-title">Due Date</div><div>${formattedDueDate}</div></div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th><th class="text-center">Qty</th><th class="text-right">Price</th><th class="text-right">Amount</th>
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
          <tr><td>Subtotal</td><td class="text-right">${formatCurrency(subtotal, data.currency)}</td></tr>
          ${data.discount > 0 ? `<tr><td>Discount</td><td class="text-right">-${formatCurrency(discountAmount, data.currency)}</td></tr>` : ''}
          ${data.taxRate > 0 ? `<tr><td>Tax</td><td class="text-right">${formatCurrency(taxAmount, data.currency)}</td></tr>` : ''}
          <tr class="total-row"><td>Total</td><td class="text-right">${formatCurrency(total, data.currency)}</td></tr>
        </table>
      </div>

      <div class="footer">
        ${data.notes ? `<div style="margin-bottom:16px;"><strong>Notes:</strong><br>${safeStr(data.notes)}</div>` : ''}
        ${data.paymentTerms ? `<div><strong>Payment Terms:</strong><br>${safeStr(data.paymentTerms)}</div>` : ''}
      </div>
    </body>
    </html>
  `;
}
