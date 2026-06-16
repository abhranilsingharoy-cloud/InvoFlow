import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  message?: string;
  pdfBuffer: Buffer;
  invoiceNumber: string;
}

export async function sendInvoiceEmail({ to, subject, message, pdfBuffer, invoiceNumber }: SendEmailParams) {
  // Read from environment variables
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_APP_PASSWORD;
  const fromName = process.env.EMAIL_FROM_NAME || process.env.NEXT_PUBLIC_APP_NAME || "InvoFlow";
  const fromEmail = smtpUser;

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP credentials are not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const defaultMessage = `Hello,

Please find attached the invoice ${invoiceNumber}.

Thank you for your business!

Best regards,
${fromName}`;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text: message || defaultMessage,
    attachments: [
      {
        filename: `Invoice_${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
