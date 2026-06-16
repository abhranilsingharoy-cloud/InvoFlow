import React from "react";
import { InvoiceData } from "@/lib/validators";
import { calculateTotals, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const { subtotal, taxAmount, discountAmount, total } = calculateTotals(
    data.items,
    data.taxRate,
    data.discount
  );

  const formattedIssueDate = data.issueDate ? format(new Date(data.issueDate), 'MMM dd, yyyy') : '';
  const formattedDueDate = data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : '';

  let containerClass = "p-8 sm:p-12 w-[794px] min-h-[1123px] shadow-sm ring-1 ring-slate-200 text-slate-900 text-sm mx-auto bg-white ";
  if (data.templateStyle === 'bold') {
    containerClass += "font-sans border-t-[16px] border-black text-gray-900";
  } else if (data.templateStyle === 'classic') {
    containerClass += "font-serif text-gray-800";
  } else if (data.templateStyle === 'modern') {
    containerClass += "font-sans border-l-[16px] border-indigo-600 text-slate-800";
  } else if (data.templateStyle === 'elegant') {
    containerClass += "font-serif border-double border-[12px] border-slate-800 text-slate-900 bg-amber-50/10";
  } else {
    containerClass += "font-sans";
  }

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {data.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoUrl} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
          ) : (
            <div className="h-20 w-48 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs rounded-md">
              Logo Area
            </div>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">INVOICE</h1>
          <p className="text-slate-500 mt-1">{data.invoiceNumber || "INV-000000"}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From</h3>
          <div className="space-y-1">
            <p className="font-semibold text-base">{data.senderName || "Your Name/Company"}</p>
            {data.senderEmail && <p className="text-slate-600">{data.senderEmail}</p>}
            {data.senderAddress && <p className="text-slate-600 whitespace-pre-wrap">{data.senderAddress}</p>}
          </div>
        </div>
        
        <div className="col-span-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To</h3>
          <div className="space-y-1">
            <p className="font-semibold text-base">{data.clientName || "Client Name"}</p>
            {data.clientEmail && <p className="text-slate-600">{data.clientEmail}</p>}
            {data.clientAddress && <p className="text-slate-600 whitespace-pre-wrap">{data.clientAddress}</p>}
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Issue Date</p>
              <p className="font-medium">{formattedIssueDate || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="font-medium">{formattedDueDate || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-slate-200 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="border-b-2 border-slate-200 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-24">Qty</th>
              <th className="border-b-2 border-slate-200 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Price</th>
              <th className="border-b-2 border-slate-200 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id || index}>
                <td className="py-4 border-b border-slate-100">{item.description || "-"}</td>
                <td className="py-4 border-b border-slate-100 text-center">{item.quantity || 0}</td>
                <td className="py-4 border-b border-slate-100 text-right">{formatCurrency(item.price || 0, data.currency)}</td>
                <td className="py-4 border-b border-slate-100 text-right font-medium">
                  {formatCurrency((item.quantity || 0) * (item.price || 0), data.currency)}
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 border-b border-slate-100">
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, data.currency)}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount, data.currency)}</span>
            </div>
          )}
          {data.taxRate > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({data.taxRate}%)</span>
              <span>{formatCurrency(taxAmount, data.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-blue-600 border-t-2 border-slate-200 pt-3 mt-3">
            <span>Total</span>
            <span>{formatCurrency(total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(data.notes || data.paymentTerms) && (
        <div className="border-t border-slate-200 pt-8 space-y-6">
          {data.notes && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Notes</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}
          {data.paymentTerms && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Payment Terms</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{data.paymentTerms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
