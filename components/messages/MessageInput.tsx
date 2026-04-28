"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, lazy, Suspense } from "react";
import { Theme } from "emoji-picker-react";
import { Send, Smile, X, Loader2, Paperclip } from "lucide-react";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

type Props = {
  onSend: (text: string, imageFile: File | null) => Promise<void>;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (sending || disabled || (!text.trim() && !imageFile)) return;
    setSending(true);
    try {
      await onSend(text, imageFile);
      setText("");
      clearImage();
      setShowEmoji(false);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="relative">
      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-full right-4 mb-2 z-50">
          <Suspense fallback={<div className="w-[350px] h-[400px] bg-iron-depth rounded-xl border border-white/10 flex items-center justify-center"><Loader2 size={20} className="text-white/30 animate-spin" /></div>}>
            <EmojiPicker
              onEmojiClick={(data) => {
                setText((prev) => prev + data.emoji);
                textareaRef.current?.focus();
              }}
              theme={Theme.DARK}
              searchPlaceholder="Search emoji…"
              width={340}
              height={420}
            />
          </Suspense>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="relative inline-block mx-4 mt-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 rounded-lg object-cover border border-white/10"
          />
          <button
            onClick={clearImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-iron-depth border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
        {/* Attach file */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-primary hover:bg-primary/10 transition-colors"
          title="Attach image or file"
        >
          <Paperclip size={17} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Text */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={disabled || sending}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors resize-none disabled:opacity-50 max-h-32 overflow-y-auto"
          style={{ lineHeight: "1.5" }}
        />

        {/* Emoji */}
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            showEmoji
              ? "text-primary bg-primary/10"
              : "text-white/40 hover:text-primary hover:bg-primary/10"
          }`}
          title="Emoji"
        >
          <Smile size={17} />
        </button>

        {/* Send */}
        <button
          type="submit"
          disabled={disabled || sending || (!text.trim() && !imageFile)}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </div>
  );
}
