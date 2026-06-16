import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Send, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Now with email delivery</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Create. Send. <br className="hidden md:block" />
            <span className="text-blue-600">Get Paid.</span> In Seconds.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The smart invoice generator for freelancers and small business owners. 
            Generate polished PDFs and email them directly to your clients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/invoice">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full">
                Create Invoice
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Premium Features, Zero Cost</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Live PDF Preview</h3>
              <p className="text-slate-600 leading-relaxed">
                See exactly what your client will see with our real-time, pixel-perfect PDF preview engine.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Emailing</h3>
              <p className="text-slate-600 leading-relaxed">
                Send your generated invoice directly to your client's inbox as a PDF attachment with one click.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                Built on serverless architecture, ensuring your invoices are generated and sent in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
