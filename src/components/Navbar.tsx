import React from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">InvoFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/invoice" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Builder
            </Link>
            <a href="https://github.com/abhranilsingharoy-cloud/InvoFlow" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
