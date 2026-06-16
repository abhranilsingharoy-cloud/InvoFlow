import React from "react";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { getRiskLevel } from "@/lib/ml";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const allInvoices = await db.select().from(invoices);
  
  const totalRevenue = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingCount = allInvoices.filter(i => i.status === 'pending').length;
  
  // Calculate average risk score
  const avgRisk = allInvoices.length > 0 
    ? allInvoices.reduce((sum, inv) => sum + (inv.mlRiskScore || 0), 0) / allInvoices.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your business and AI predictions.</p>
        </div>
        <Link href="/invoice">
          <Button>Create New Invoice</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Total Revenue Generated</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue, "USD")}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Pending Invoices</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Avg. Late Payment Risk</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{(avgRisk * 100).toFixed(1)}%</p>
          <p className="text-xs text-slate-400 mt-1">Powered by Advanced ML</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Invoices</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Risk Level</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allInvoices.map((inv) => {
              const riskLevel = getRiskLevel(inv.mlRiskScore || 0);
              return (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{inv.invoiceNumber}</td>
                  <td className="p-4 text-slate-600">{inv.clientName}</td>
                  <td className="p-4 text-slate-900 font-medium">{formatCurrency(inv.totalAmount, inv.currency || "USD")}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                      riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {riskLevel} ({( (inv.mlRiskScore || 0) * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-slate-600">{inv.status}</span>
                  </td>
                </tr>
              )
            })}
            {allInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No invoices found. Create one to see it here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
