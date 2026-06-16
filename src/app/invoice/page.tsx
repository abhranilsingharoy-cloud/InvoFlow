"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceSchema, InvoiceData } from "@/lib/validators";
import { generateInvoiceNumber } from "@/lib/utils";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Button } from "@/components/ui/button";
import { Download, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function InvoiceBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<InvoiceData>({
    resolver: zodResolver(InvoiceSchema) as any,
    defaultValues: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 15 days later
      items: [{ id: "1", description: "", quantity: 1, price: 0 }],
      currency: "USD",
      taxRate: 0,
      discount: 0,
    },
  });

  const watchAllFields = form.watch();

  const handleDownloadPDF = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors in the form before generating the PDF.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating your PDF...");

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchAllFields),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${watchAllFields.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF generated successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating the PDF.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors in the form before sending.");
      return;
    }

    if (!watchAllFields.clientEmail) {
      toast.error("Client email is required to send the invoice.");
      form.setError("clientEmail", { type: "manual", message: "Client email is required" });
      return;
    }

    setIsSending(true);
    const loadingToast = toast.loading("Sending invoice to client...");

    try {
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceData: watchAllFields,
          recipientEmail: watchAllFields.clientEmail,
          subject: `Invoice ${watchAllFields.invoiceNumber} from ${watchAllFields.senderName || "us"}`,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to send email");
      }

      toast.success(`Invoice sent to ${watchAllFields.clientEmail} ✅`, { id: loadingToast });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred while sending the email.", { id: loadingToast });
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    
    setIsSaving(true);
    const loadingToast = toast.loading("Saving invoice to dashboard...");
    
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchAllFields),
      });
      
      if (!response.ok) throw new Error("Failed to save");
      toast.success("Invoice saved to dashboard! Automations active.", { id: loadingToast });
    } catch (error) {
      toast.error("Error saving invoice.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoice Builder</h1>
          <p className="text-slate-500 mt-1">Fill out the details on the left to see the live preview on the right.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isGenerating || isSending || isSaving}
            className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "💾"} Save to Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 lg:flex-none"
            onClick={handleDownloadPDF}
            disabled={isGenerating || isSending || isSaving}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
          </Button>
          <Button 
            className="flex-1 lg:flex-none"
            onClick={handleSendEmail}
            disabled={isGenerating || isSending}
          >
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Send via Email
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <InvoiceForm form={form} />
        </div>

        {/* Right Column: Preview */}
        <div className="lg:sticky lg:top-8 border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex flex-col h-[calc(100vh-4rem)]">
          <div className="bg-slate-100 p-3 flex justify-between items-center border-b border-slate-200 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded shadow-sm">A4 Format</span>
          </div>
          <div className="overflow-auto flex-1 p-4 sm:p-8 bg-slate-200/50 flex justify-center items-start">
            <div className="shrink-0 shadow-xl ring-1 ring-slate-900/5">
              <InvoicePreview data={watchAllFields} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
