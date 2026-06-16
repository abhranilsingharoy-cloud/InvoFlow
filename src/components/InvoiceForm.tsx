import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InvoiceData } from "@/lib/validators";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LogoUpload } from "./LogoUpload";
import { LineItemRow } from "./LineItemRow";
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
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select 
                id="currency" 
                {...register("currency")}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
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
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent mt-2"
              placeholder="Thanks for your business!"
            />
          </div>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <textarea
              id="paymentTerms"
              {...register("paymentTerms")}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent mt-2"
              placeholder="Please pay within 15 days using the link provided."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
