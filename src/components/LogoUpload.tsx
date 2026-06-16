import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface LogoUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">Logo</span>
      {value ? (
        <div className="relative w-32 h-32 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Logo preview" className="max-w-full max-h-full object-contain p-2" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Upload className="w-6 h-6 text-slate-400 mb-2" />
          <span className="text-xs text-slate-500 font-medium">Upload Logo</span>
          <span className="text-[10px] text-slate-400 mt-1">Max 2MB</span>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/svg+xml"
        className="hidden"
      />
    </div>
  );
}
