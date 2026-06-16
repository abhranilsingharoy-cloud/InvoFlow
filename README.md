<div align="center">
  <h1>🚀 InvoFlow: The Ultimate Smart Invoice Generator</h1>
  <p><strong>Developed and Design by Abhranil Sinhgha Roy</strong></p>
  <p>A premium, serverless-ready web application for freelancers and small businesses to generate, preview, and email beautiful PDF invoices in seconds. Powered by Advanced AI, OCR, and predictive Machine Learning.</p>
</div>

---

## ✨ Advanced Features

- 🎨 **Sleek UI with Dark/Light Mode**: A highly responsive, meticulously designed interface with a built-in Dark Mode toggle powered by `next-themes` and Tailwind CSS v4.
- ⚡ **Dynamic Invoice Builder**: Real-time invoice preview that perfectly matches the final PDF output.
- 🧾 **AI-Powered Receipt Scanner (OCR)**: Upload an image of a physical receipt, and Tesseract.js will automatically extract the line items and prices directly in your browser.
- 🤖 **Predictive Dashboard (ML)**: Save invoices to a local database and instantly view the Machine Learning-powered "Late Payment Risk Score" for each client.
- 🖌️ **5 Premium Templates**: Switch between **Minimal, Bold, Classic, Modern, and Elegant** PDF templates to match your brand's unique style.
- 💱 **Live Currency Conversion**: Automatically convert line-item prices to international currencies using real-time API exchange rates.
- 📄 **Instant PDF Generation**: Uses `puppeteer-core` and `@sparticuz/chromium` to generate highly customized, pixel-perfect PDFs on-the-fly via Vercel Serverless Functions.
- ✉️ **Direct Emailing**: Seamlessly send the generated PDF directly to clients using `nodemailer` and an SMTP service (e.g., Gmail).
- ⚙️ **Automations Engine**: Vercel CRON job integration to automatically scan pending invoices and send reminders 3 days before an invoice is due or if it's overdue.

## 🛠️ Tech Stack & Architecture

- **Core**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion, `next-themes` (Dark Mode)
- **Database**: `better-sqlite3` & Drizzle ORM (Easily swappable to Vercel Postgres/Neon)
- **AI/ML**: Python (Random Forest training), JavaScript Heuristic Port, `Tesseract.js` (OCR)
- **PDF Generation**: `@sparticuz/chromium` (Vercel-optimized headless browser)
- **Validation**: Zod & `react-hook-form`

## 📁 Project Structure

The codebase is engineered following an advanced Next.js 14 modular architecture:

```text
InvoFlow/
├── .github/                 # CI/CD Workflows and PR Templates
├── ml/                      # Python Machine Learning scripts and synthetic data
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── api/             # Serverless Functions (cron, pdf, email, invoices)
│   │   ├── dashboard/       # ML Predictive Dashboard Page
│   │   ├── invoice/         # Main Invoice Builder Page
│   │   └── globals.css      # Core CSS tokens and Dark Mode variants
│   ├── components/          # Reusable React Components
│   │   ├── ui/              # Base UI primitives (Buttons, Cards, Inputs) styled for Dark Mode
│   │   └── ...              # Forms, Previews, Scanners, and Navigation
│   ├── db/                  # Drizzle ORM Schema and Database connection
│   └── lib/                 # Core Business Logic
│       ├── mailer.ts        # Nodemailer config
│       ├── ml.ts            # JS port of the ML late-payment heuristic
│       ├── pdfGenerator.ts  # Headless Chromium PDF renderer
│       ├── pdfTemplate.ts   # HTML/CSS injection for the 5 Premium Templates
│       ├── utils.ts         # Formatting & helper utilities
│       └── validators.ts    # Strict Zod schemas for data validation
├── public/                  # Static assets and fonts
├── drizzle.config.ts        # Database migration configuration
├── next.config.ts           # Next.js compiler configuration
└── vercel.json              # Serverless execution timeouts & Cron schedules
```

## 🚀 Local Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/abhranilsingharoy-cloud/InvoFlow.git
   cd InvoFlow
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and configure your SMTP credentials for email delivery.
   ```bash
   cp .env.example .env.local
   ```
   *Note: For free Gmail SMTP, enable 2-Step Verification in Google Settings and generate an "App Password".*

3. **Initialize Local Database**
   ```bash
   npm run db:push
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

> **Note on Local PDF Generation**: 
> `@sparticuz/chromium` is optimized for Vercel. For local development, the code will automatically attempt to use your local Chrome installation. If PDF generation fails locally, set `CHROME_EXECUTABLE_PATH` in your `.env.local` to point to your Chrome browser executable.

## ☁️ Deployment (Vercel)

This application is strictly optimized to deploy on **Vercel's free Hobby plan**. 

1. Push your code to your GitHub repository.
2. Import the repository into your Vercel dashboard.
3. Configure Environment Variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
4. **Important**: Because Vercel is serverless, the local `sqlite.db` will not persist across requests. You must swap the SQLite database for a cloud provider like **Vercel Postgres**, **Neon**, or **Turso** for the Dashboard and Automations to function correctly in production.
5. Deploy!

## 🔒 Security Considerations

- **Strict Validation**: All API routes and forms use strongly-typed `zod` schemas.
- **XSS Protection**: User inputs are encoded via `html-entities` before being injected into the HTML string for PDF rendering.
- **Environment Isolation**: Credentials are read strictly via secure server environment variables.
