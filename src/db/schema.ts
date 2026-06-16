import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(), // We will use invoiceNumber as ID or a UUID
  invoiceNumber: text("invoice_number").notNull(),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").notNull(),
  
  senderName: text("sender_name").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  
  totalAmount: real("total_amount").notNull(),
  currency: text("currency").default("USD"),
  
  status: text("status").default("pending"), // pending, paid, overdue
  mlRiskScore: real("ml_risk_score"), // Late payment probability (0 to 1)
  
  isRecurring: integer("is_recurring", { mode: 'boolean' }).default(false),
  recurringInterval: text("recurring_interval"), // e.g. 'monthly', 'weekly'
  autoRemind: integer("auto_remind", { mode: 'boolean' }).default(false),
  
  createdAt: text("created_at").notNull(),
  invoiceDataJson: text("invoice_data_json").notNull(), // Full JSON of the invoice for re-rendering
});
