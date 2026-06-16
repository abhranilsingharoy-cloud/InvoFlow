import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Receipt, Zap, Bot, Mail, BarChart, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-500/10 dark:from-blue-500/20 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>V2.0 Now Live with AI Predictions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Create. Send. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Get Paid.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            The smartest serverless invoice generator for freelancers. Build stunning PDFs, predict late payments with Machine Learning, and automate your follow-ups.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/invoice">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                Build an Invoice <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-slate-300 dark:border-slate-700 bg-transparent">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">From receipt to paid invoice in three simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold">Upload or Type</h3>
              <p className="text-slate-600 dark:text-slate-400">Use our AI-powered OCR to scan a physical receipt, or type your line items manually.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold">Customize & Predict</h3>
              <p className="text-slate-600 dark:text-slate-400">Choose a premium template, convert currencies, and instantly see the ML late-payment risk score.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold">Send & Automate</h3>
              <p className="text-slate-600 dark:text-slate-400">Email the PDF directly to your client. Our CRON job will automatically follow up if it becomes overdue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to manage your billing, entirely serverless.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Receipt, title: "Live PDF Rendering", desc: "Pixel-perfect WYSIWYG preview powered by headless Chromium." },
              { icon: Bot, title: "AI Receipt Scanner", desc: "Extract line items and prices from images instantly using Tesseract.js." },
              { icon: BarChart, title: "Predictive ML Dashboard", desc: "Know which clients will pay late before you even send the invoice." },
              { icon: Mail, title: "Automated Reminders", desc: "Never chase a payment again. Vercel Cron jobs send emails for you." },
              { icon: Zap, title: "Live Currency Conversion", desc: "Fetch real-time exchange rates and convert your entire invoice instantly." },
              { icon: ShieldCheck, title: "Free & Open Source", desc: "No hidden fees, no subscriptions. Host it yourself on Vercel for free." },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Simple Pricing</h2>
          <p className="text-slate-400 mb-12">We believe standard business tools shouldn't cost a monthly subscription.</p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 text-left max-w-2xl mx-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-8">
              <div>
                <h3 className="text-3xl font-bold">Free Forever</h3>
                <p className="text-slate-300 mt-2">Open Source License</p>
              </div>
              <div className="text-5xl font-extrabold">$0<span className="text-xl text-slate-400 font-medium">/mo</span></div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited PDF Invoices",
                "Machine Learning Dashboard",
                "Automated Email Reminders",
                "Multi-currency & Templates",
                "Self-hosted on Vercel"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/invoice">
              <Button className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-2">Do I need to create an account?</h4>
              <p className="text-slate-600 dark:text-slate-400">No! If you are running this locally, your data is saved in a local SQLite database. If you deploy it to your own Vercel account, you control the data completely.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">How does the ML Risk Score work?</h4>
              <p className="text-slate-600 dark:text-slate-400">Our Machine Learning model was trained on historical synthetic invoice data. It evaluates parameters like total amount, tax rates, and payment terms to predict the statistical probability of a late payment.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Are there any hidden fees?</h4>
              <p className="text-slate-600 dark:text-slate-400">None. InvoFlow is open source. You can fork it and use it entirely for free within Vercel's generous Hobby tier limits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">About InvoFlow</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            InvoFlow was created to solve a simple problem: traditional invoicing software is bloated, expensive, and slow. We wanted to build a tool that felt as fast as a modern SaaS app, looked beautiful, and was entirely free for freelancers and small businesses to host themselves. 
            <br /><br />
            By leveraging Vercel's serverless edge and the Next.js App Router, InvoFlow operates with zero fixed server costs while delivering premium features like OCR and Machine Learning.
          </p>
          <div className="inline-flex items-center gap-2 text-slate-500 font-medium">
            <span>Built with ❤️ by the Open Source Community</span>
          </div>
        </div>
      </section>

    </div>
  );
}
