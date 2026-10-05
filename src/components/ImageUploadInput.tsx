import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { DEFAULT_PLACEHOLDER_IMAGE, PRESET_IMAGES } from '../services/productStorage';

interface ImageUploadInputProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  required?: boolean;
}

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Product Image',
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // 1. Validate file type (PNG, JPG, JPEG)
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid file type. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // 2. Validate file size (Max 2MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File exceeds 2MB limit (${formatFileSize(file.size)}). Please choose a smaller image.`);
      return;
    }

    // 3. Convert to base64 Data URL for persistent in-browser storage & Vite/Vercel compatibility
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onChange(base64);
        setFileDetails({
          name: file.name,
          size: formatFileSize(file.size),
        });
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(DEFAULT_PLACEHOLDER_IMAGE);
    setFileDetails(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewImage = value || DEFAULT_PLACEHOLDER_IMAGE;
  const isCustomUploaded = value && value.startsWith('data:image/');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        <span className="text-[11px] font-mono text-zinc-500">
          PNG, JPG or JPEG &bull; Max 2MB
        </span>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        className="hidden"
        id="admin-product-image-upload"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <UploadCloud className="w-6 h-6 stroke-[1.75]" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-medium text-white">
              <span className="text-amber-400 font-semibold underline underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop your product image
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Direct upload &bull; Auto-converted to persistent image data
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors border border-zinc-700"
          >
            Select Image File
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2 font-mono animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Immediate Image Preview Thumbnail Card */}
      {previewImage && (
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail */}
            <div className="w-16 h-20 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-700 shrink-0 relative group">
              <img
                src={previewImage}
                alt="Product Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Details */}
            <div className="min-w-0 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px] mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isCustomUploaded ? 'Custom Image Ready' : 'Selected Archive Visual'}
                </span>
              </div>
              <p className="text-white font-sans font-semibold text-xs truncate max-w-[200px] sm:max-w-xs">
                {fileDetails ? fileDetails.name : 'Active Preview Image'}
              </p>
              <span className="text-[11px] text-zinc-500">
                {fileDetails ? fileDetails.size : 'Optimized format'}
              </span>
            </div>
          </div>

          {/* Change / Reset Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono uppercase rounded transition-colors"
            >
              Replace
            </button>
            {isCustomUploaded && (
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                title="Reset to default image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Streetwear Presets Selection */}
      <div className="pt-1">
        <span className="text-[11px] font-mono text-zinc-500 block mb-1.5">
          Or pick from brand presets:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setFileDetails({ name: preset.label, size: 'Stock' });
                setErrorMessage(null);
              }}
              className={`p-1 border rounded-lg text-center flex flex-col items-center gap-1 transition-all ${
                value === preset.url
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-10 h-10 rounded object-cover"
              />
              <span className="text-[9px] font-mono text-zinc-400 truncate w-full">
                {preset.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
