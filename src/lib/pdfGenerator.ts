import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function generatePDF(html: string): Promise<Buffer> {
  let browser = null;
  try {
    const isLocal = process.env.NODE_ENV === "development";
    
    // In local development, we might not have the chromium binary via sparticuz.
    // If you are on Windows/Mac, you typically need to point to your local Chrome installation.
    // This provides a fallback if local development Chrome isn't specified.
    let executablePath = null;
    if (isLocal) {
      // Common Windows path
      executablePath = process.env.CHROME_EXECUTABLE_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else {
      executablePath = await chromium.executablePath();
    }

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath || undefined,
      headless: isLocal ? true : chromium.headless,
    });

    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    // Emulate media type for printing
    await page.emulateMediaType("print");

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
