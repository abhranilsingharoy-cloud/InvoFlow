import React from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">InvoFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/invoice" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Builder
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
