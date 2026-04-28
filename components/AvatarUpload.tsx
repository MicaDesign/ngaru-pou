"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "./Avatar";

type Props = {
  currentUrl?: string | null;
  name: string;
  size?: number;
  onUpload: (file: File) => Promise<string>;
  onSaved?: (url: string) => void;
};

export default function AvatarUpload({ currentUrl, name, size = 80, onUpload, onSaved }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError("");
    setUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
      onSaved?.(url);
    } catch {
      setError("Upload failed — please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const displayed = preview ?? currentUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="relative group"
        aria-label="Change avatar"
      >
        <Avatar src={displayed} name={name} size={size} />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading
            ? <Loader2 size={size * 0.3} className="text-white animate-spin" />
            : <Camera size={size * 0.3} className="text-white" />
          }
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="font-sans text-xs text-semantic-red">{error}</p>}
      <p className="font-sans text-xs text-white/35">Click to change photo</p>
    </div>
  );
}
