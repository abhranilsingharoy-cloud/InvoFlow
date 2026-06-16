import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function calculateTotals(items: { quantity: number; price: number }[], taxRate: number, discount: number) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
  const discountAmount = discount || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * ((taxRate || 0) / 100);
  const total = taxableAmount + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
}

export function generateInvoiceNumber() {
  return `INV-${Date.now().toString().slice(-6)}`;
}
