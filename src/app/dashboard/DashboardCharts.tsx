"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface InvoiceRecord {
  invoiceNumber: string;
  totalAmount: number;
  status: string;
}

interface DashboardChartsProps {
  invoices: InvoiceRecord[];
}

export function DashboardCharts({ invoices }: DashboardChartsProps) {
  // Data for Bar Chart: Revenue per Invoice
  const barData = invoices.map(inv => ({
    name: inv.invoiceNumber,
    amount: inv.totalAmount
  }));

  // Data for Pie Chart: Status Distribution
  const statusCounts = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: statusCounts[key]
  }));

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Revenue by Invoice</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Invoice Status Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
