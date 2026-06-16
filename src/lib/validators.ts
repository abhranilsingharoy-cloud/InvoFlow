import * as z from "zod";

export const LineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be > 0"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export const InvoiceSchema = z.object({
  logoUrl: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  senderAddress: z.string().optional(),
  
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid client email"),
  clientAddress: z.string().optional(),
  
  items: z.array(LineItemSchema).min(1, "At least one item is required"),
  
  currency: z.string().default("USD"),
  taxRate: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  templateStyle: z.enum(["minimal", "bold", "classic", "modern", "elegant"]).default("minimal"),
  
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
});

export type LineItem = z.infer<typeof LineItemSchema>;
export type InvoiceData = z.infer<typeof InvoiceSchema>;

export const SendEmailSchema = z.object({
  invoiceData: InvoiceSchema,
  recipientEmail: z.string().email(),
  subject: z.string().min(1).default("Your Invoice"),
  message: z.string().optional(),
});
