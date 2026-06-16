import { NextResponse } from "next/server";
import { SendEmailSchema } from "@/lib/validators";
import { generateInvoiceHTML } from "@/lib/pdfTemplate";
import { generatePDF } from "@/lib/pdfGenerator";
import { sendInvoiceEmail } from "@/lib/mailer";

export const maxDuration = 10; // Applies to Vercel

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const validatedData = SendEmailSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validatedData.error.issues },
        { status: 400 }
      );
    }
    
    const { invoiceData, recipientEmail, subject, message } = validatedData.data;
    
    const html = generateInvoiceHTML(invoiceData);
    const pdfBuffer = await generatePDF(html);
    
    await sendInvoiceEmail({
      to: recipientEmail,
      subject,
      message,
      pdfBuffer,
      invoiceNumber: invoiceData.invoiceNumber,
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Ensure SMTP credentials are correct." },
      { status: 500 }
    );
  }
}
