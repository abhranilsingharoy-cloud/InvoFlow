import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Tesseract from "tesseract.js";
import { toast } from "sonner";

interface ReceiptScannerProps {
  onScanComplete: (items: { description: string; price: number; quantity: number }[]) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const toastId = toast.loading("Scanning receipt...");

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      
      // Super naive heuristic to extract line items with prices
      // Matches lines that end with a price, e.g. "Coffee 4.50"
      const lines = text.split("\n");
      const items = [];

      const priceRegex = /[\$£€]?\s*(\d+[\.,]\d{2})\b/;

      for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(priceRegex);
        if (match) {
          const price = parseFloat(match[1].replace(',', '.'));
          const description = line.replace(match[0], '').trim();
          if (description.length > 2 && price > 0) {
            items.push({ description, price, quantity: 1 });
          }
        }
      }

      if (items.length > 0) {
        onScanComplete(items);
        toast.success(`Found ${items.length} items!`, { id: toastId });
      } else {
        toast.error("Could not find any items or prices on this receipt.", { id: toastId });
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to scan receipt.", { id: toastId });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
      >
        {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        Auto-Fill from Receipt
      </Button>
    </div>
  );
}
