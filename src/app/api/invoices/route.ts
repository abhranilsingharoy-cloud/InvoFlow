import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { InvoiceSchema } from "@/lib/validators";
import { calculateTotals } from "@/lib/utils";
import { predictLatePaymentProbability } from "@/lib/ml";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = InvoiceSchema.parse(body);
    
    const { total } = calculateTotals(validatedData.items, validatedData.taxRate, validatedData.discount);
    
    // Parse payment terms if available (e.g. "Net 30") or default to 30
    const paymentTermsStr = validatedData.paymentTerms || "30";
    const paymentTermsMatch = paymentTermsStr.match(/\d+/);
    const paymentTermsDays = paymentTermsMatch ? parseInt(paymentTermsMatch[0], 10) : 30;

    // Use ML heuristic
    const mlRiskScore = predictLatePaymentProbability(
      total, 
      validatedData.taxRate, 
      validatedData.discount, 
      paymentTermsDays
    );

    // Insert into SQLite DB
    await db.insert(invoices).values({
      id: validatedData.invoiceNumber + "_" + Date.now(),
      invoiceNumber: validatedData.invoiceNumber,
      issueDate: validatedData.issueDate,
      dueDate: validatedData.dueDate,
      senderName: validatedData.senderName,
      clientName: validatedData.clientName,
      clientEmail: validatedData.clientEmail,
      totalAmount: total,
      currency: validatedData.currency,
      status: "pending",
      mlRiskScore,
      isRecurring: false, // Could be mapped from form if added
      autoRemind: true,   // Default to true for the sake of the feature
      createdAt: new Date().toISOString(),
      invoiceDataJson: JSON.stringify(validatedData),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save invoice:", error);
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  }
}
