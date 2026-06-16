import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sendInvoiceEmail } from "@/lib/mailer";
import { generateInvoiceHTML } from "@/lib/pdfTemplate";
import { generatePDF } from "@/lib/pdfGenerator";
import { format, differenceInDays } from "date-fns";

export const maxDuration = 10;

// This would be triggered by Vercel CRON daily
export async function GET(req: Request) {
  // Authorization check (Vercel Cron Secret)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find pending invoices with autoRemind = true
    const pendingInvoices = await db.select().from(invoices).where(
      and(eq(invoices.status, "pending"), eq(invoices.autoRemind, true))
    );

    let remindedCount = 0;
    const today = new Date();

    for (const inv of pendingInvoices) {
      const dueDate = new Date(inv.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);

      // Send reminder if exactly 3 days before due, or if 1 day overdue
      if (daysUntilDue === 3 || daysUntilDue === -1) {
        const invoiceData = JSON.parse(inv.invoiceDataJson);
        const html = generateInvoiceHTML(invoiceData);
        const pdfBuffer = await generatePDF(html);

        const subject = daysUntilDue < 0 
          ? `OVERDUE: Invoice ${inv.invoiceNumber} is past due` 
          : `Reminder: Invoice ${inv.invoiceNumber} is due in 3 days`;

        await sendInvoiceEmail({
          to: inv.clientEmail,
          subject,
          pdfBuffer,
          invoiceNumber: inv.invoiceNumber,
        });

        remindedCount++;
      }
    }

    return NextResponse.json({ success: true, remindedCount });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Automation failed" }, { status: 500 });
  }
}
