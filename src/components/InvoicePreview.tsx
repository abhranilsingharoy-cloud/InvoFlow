import React from "react";
import { InvoiceData } from "@/lib/validators";
import { calculateTotals, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { translations } from "@/lib/translations";

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
  const lang = data.language && data.language in translations ? data.language as keyof typeof translations : "en";
  const t = translations[lang];
  const safeStr = (str?: string) => str || "";

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
      <div className="flex justify-between items-start mb-10">
        <div>
          {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />}
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-slate-900 mb-1">{t.invoice}</h1>
          <p className="text-slate-500 font-medium">{safeStr(data.invoiceNumber)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.from}</h3>
          <div className="font-semibold text-slate-900">{safeStr(data.senderName)}</div>
          <div className="text-slate-500">{safeStr(data.senderEmail)}</div>
          <div className="text-slate-500 whitespace-pre-wrap">{safeStr(data.senderAddress)}</div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.to}</h3>
          <div className="font-semibold text-slate-900">{safeStr(data.clientName)}</div>
          <div className="text-slate-500">{safeStr(data.clientEmail)}</div>
          <div className="text-slate-500 whitespace-pre-wrap">{safeStr(data.clientAddress)}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.issueDate}</div>
              <div className="font-medium">{formattedIssueDate}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.dueDate}</div>
              <div className="font-medium">{formattedDueDate}</div>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.description}</th>
            <th className="text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.qty}</th>
            <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.price}</th>
            <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.amount}</th>
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
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-72">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">{t.subtotal}</span>
            <span className="font-medium">{formatCurrency(subtotal, data.currency)}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t.discount}</span>
              <span className="font-medium text-red-500">-{formatCurrency(discountAmount, data.currency)}</span>
            </div>
          )}
          {data.taxRate > 0 && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">{t.tax}</span>
              <span className="font-medium">{formatCurrency(taxAmount, data.currency)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-t-2 border-slate-900 mt-2">
            <span className="font-bold text-lg">{t.total}</span>
            <span className="font-bold text-lg">{formatCurrency(total, data.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-200 text-sm flex justify-between items-end">
        <div>
          {data.notes && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 mb-1">{t.notes}</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{safeStr(data.notes)}</p>
            </div>
          )}
          {data.paymentTerms && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">{t.paymentTerms}</h4>
              <p className="text-slate-600 whitespace-pre-wrap">{safeStr(data.paymentTerms)}</p>
            </div>
          )}
        </div>
        {data.paymentLink && (
          <div>
            <img src={`https://quickchart.io/qr?text=${encodeURIComponent(data.paymentLink)}&size=100`} alt="QR Code" className="w-[100px] h-[100px] rounded-lg shadow-sm border border-slate-200" />
          </div>
        )}
      </div>
    </div>
  );
}
