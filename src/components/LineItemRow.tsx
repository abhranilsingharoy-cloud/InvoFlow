import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { InvoiceData } from "@/lib/validators";

interface LineItemRowProps {
  index: number;
  register: UseFormRegister<InvoiceData>;
  errors: FieldErrors<InvoiceData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function LineItemRow({ index, register, errors, onRemove, canRemove }: LineItemRowProps) {
  const itemErrors = errors.items?.[index];

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50 relative group">
      <div className="flex-1 space-y-4">
        <div>
          <Input
            placeholder="Item description"
            {...register(`items.${index}.description` as const)}
            className="bg-white"
          />
          {itemErrors?.description && (
            <p className="text-red-500 text-xs mt-1">{itemErrors.description.message}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="w-1/3">
            <Input
              type="number"
              step="0.01"
              placeholder="Qty"
              {...register(`items.${index}.quantity` as const)}
              className="bg-white"
            />
            {itemErrors?.quantity && (
              <p className="text-red-500 text-xs mt-1">{itemErrors.quantity.message}</p>
            )}
          </div>
          <div className="w-2/3">
            <Input
              type="number"
              step="0.01"
              placeholder="Price"
              {...register(`items.${index}.price` as const)}
              className="bg-white"
            />
            {itemErrors?.price && (
              <p className="text-red-500 text-xs mt-1">{itemErrors.price.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="text-slate-400 hover:text-red-500 transition-colors mt-1 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
