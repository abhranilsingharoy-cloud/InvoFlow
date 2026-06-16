import { NextResponse } from "next/server";
import { InvoiceSchema } from "@/lib/validators";
import { generateInvoiceHTML } from "@/lib/pdfTemplate";
import { generatePDF } from "@/lib/pdfGenerator";

export const maxDuration = 10; // Applies to Vercel

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const validatedData = InvoiceSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validatedData.error.issues },
        { status: 400 }
      );
    }
    
    const html = generateInvoiceHTML(validatedData.data);
    const pdfBuffer = await generatePDF(html);
    
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice_${validatedData.data.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
