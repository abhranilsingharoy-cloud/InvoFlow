import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InvoiceData } from "@/lib/validators";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LogoUpload } from "./LogoUpload";
import { LineItemRow } from "./LineItemRow";
import { ReceiptScanner } from "./ReceiptScanner";
import { Plus } from "lucide-react";

interface InvoiceFormProps {
  form: UseFormReturn<InvoiceData>;
}

export function InvoiceForm({ form }: InvoiceFormProps) {
  const { register, control, formState: { errors }, setValue, watch } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const logoUrl = watch("logoUrl");

  return (
    <div className="space-y-8">
      {/* Brand & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <LogoUpload 
              value={logoUrl} 
              onChange={(val) => setValue("logoUrl", val, { shouldValidate: true })} 
            />
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" {...register("invoiceNumber")} />
                {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" type="date" {...register("issueDate")} />
                  {errors.issueDate && <p className="text-red-500 text-xs mt-1">{errors.issueDate.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" {...register("dueDate")} />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sender & Client */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>From (Your Details)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="senderName">Name / Company</Label>
              <Input id="senderName" {...register("senderName")} />
              {errors.senderName && <p className="text-red-500 text-xs mt-1">{errors.senderName.message}</p>}
            </div>
            <div>
              <Label htmlFor="senderEmail">Email</Label>
              <Input id="senderEmail" type="email" {...register("senderEmail")} />
              {errors.senderEmail && <p className="text-red-500 text-xs mt-1">{errors.senderEmail.message}</p>}
            </div>
            <div>
              <Label htmlFor="senderAddress">Address</Label>
              <Input id="senderAddress" {...register("senderAddress")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To (Client Details)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" {...register("clientName")} />
              {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input id="clientEmail" type="email" {...register("clientEmail")} />
              {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail.message}</p>}
            </div>
            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Input id="clientAddress" {...register("clientAddress")} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <ReceiptScanner onScanComplete={(items) => {
            // Replace the default empty item if it's just 1 empty item
            if (fields.length === 1 && !fields[0].description) {
              remove(0);
            }
            items.forEach(item => append({ id: Date.now().toString() + Math.random(), ...item }));
          }} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <LineItemRow
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 border-dashed"
            onClick={() => append({ id: Date.now().toString(), description: "", quantity: 1, price: 0 })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
          {errors.items && !Array.isArray(errors.items) && (
            <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Totals & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="templateStyle">Template Style</Label>
              <select 
                id="templateStyle" 
                {...register("templateStyle")}
                  className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="minimal">Minimal</option>
                <option value="bold">Bold</option>
                <option value="classic">Classic</option>
              </select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <div className="flex gap-2">
                <select 
                  id="currency" 
                  {...register("currency")}
                    className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  title="Convert Prices"
                  onClick={async () => {
                    const currentCurrency = watch("currency");
                    const targetCurrency = prompt("Enter target currency code (e.g., EUR, GBP):")?.toUpperCase();
                    if (!targetCurrency || targetCurrency === currentCurrency) return;
                    
                    try {
                      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currentCurrency}`);
                      const data = await res.json();
                      const rate = data.rates[targetCurrency];
                      if (!rate) throw new Error("Invalid currency code");
                      
                      const currentItems = watch("items");
                      currentItems.forEach((item, index) => {
                        setValue(`items.${index}.price`, Number((item.price * rate).toFixed(2)));
                      });
                      setValue("currency", targetCurrency, { shouldValidate: true });
                    } catch (err) {
                      alert("Failed to convert currency.");
                    }
                  }}
                >
                  $
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" step="0.01" {...register("taxRate")} />
            </div>
            <div>
              <Label htmlFor="discount">Discount Amount</Label>
              <Input id="discount" type="number" step="0.01" {...register("discount")} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register("notes")}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mt-2"
              placeholder="Thanks for your business!"
            />
          </div>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <textarea
              id="paymentTerms"
              {...register("paymentTerms")}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mt-2"
              placeholder="Please pay within 15 days using the link provided."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
