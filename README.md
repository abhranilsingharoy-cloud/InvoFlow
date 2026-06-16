# InvoFlow: Smart Invoice Generator

InvoFlow is a premium, serverless-ready web application for freelancers and small businesses to generate, preview, and email beautiful PDF invoices in seconds.

## Features

- **Dynamic Invoice Builder**: Real-time invoice preview that perfectly matches the final PDF output.
- **Client-side Validated Forms**: Powered by `react-hook-form` and `zod` for robust data entry.
- **Instant PDF Generation**: Uses `puppeteer-core` and `@sparticuz/chromium` to generate PDFs on-the-fly via Vercel's Serverless Functions.
- **Direct Emailing**: Seamlessly send the generated PDF directly to clients using `nodemailer` and an SMTP service (e.g., Gmail).
- **Advanced Customization**: Switch between Minimal, Bold, and Classic PDF templates, and automatically convert line-item prices to live international currencies.
- **AI-Powered OCR**: Upload an image of a physical receipt and automatically extract the line items and prices.
- **Predictive Dashboard**: Save invoices to a local dashboard and instantly view the Machine Learning-powered Late Payment Risk Score.
- **Automation Engine**: Vercel CRON job integration to automatically send reminders 3 days before an invoice is due or if it's overdue.

## Tech Stack & Architecture

- **Next.js 14+ (App Router)**: Fast, full-stack React framework.
- **Tailwind CSS v4 & Framer Motion**: For a premium, highly responsive user interface.
- **better-sqlite3 & Drizzle ORM**: Used for the local dashboard and automation queues. (Can be swapped for PostgreSQL for production Vercel deployment).
- **Tesseract.js**: Client-side OCR processing.
- **@sparticuz/chromium**: **Why this instead of plain `puppeteer`?** Plain Puppeteer downloads a bundled version of Chromium that exceeds Vercel's 50MB free-tier serverless function limit. `@sparticuz/chromium` provides a compressed Brotli version specifically built for AWS Lambda/Vercel, ensuring the app deploys successfully on a free Vercel Hobby tier without exceeding limits.

## Local Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone <repository>
   cd invoflow
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your SMTP credentials.
   ```bash
   cp .env.example .env.local
   ```
   **How to get a Gmail App Password (Free SMTP)**:
   - Go to your Google Account Settings -> Security.
   - Enable 2-Step Verification.
   - Search for "App Passwords" and generate a new password for "Mail".
   - Put your Gmail address in `SMTP_USER` and the 16-digit password in `SMTP_PASS`.

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

> **Note on Local PDF Generation**: 
> `@sparticuz/chromium` doesn't always run smoothly on local Windows/Mac machines without a local binary. The code automatically attempts to use your local Chrome installation if `NODE_ENV === "development"`. If it fails locally, set `CHROME_EXECUTABLE_PATH` in your `.env.local` to point to your Chrome browser executable (e.g., `C:\Program Files\Google\Chrome\Application\chrome.exe`).

## Deployment to Vercel (Free Hobby Tier)

This application is strictly optimized to deploy on Vercel's free Hobby plan. 

1. **Push your code to GitHub**.
2. **Import the repository into Vercel**.
3. **Configure Environment Variables**: In the Vercel dashboard, before clicking Deploy, expand the Environment Variables section and add your `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`.
4. **Deploy!**

**Vercel Configuration Notice**: The `vercel.json` file explicitly sets the API route `maxDuration` to `10` seconds (the maximum limit for Hobby users) to allow enough time for the PDF generation and email process.

## Security Considerations

- The app uses strictly typed validation schemas (`zod`) to sanitize incoming data.
- The user inputs are encoded via `html-entities` before being injected into the HTML string for PDF rendering to prevent HTML/XSS injections.
- Credentials are read via server environment variables, never exposed to the client bundle.
