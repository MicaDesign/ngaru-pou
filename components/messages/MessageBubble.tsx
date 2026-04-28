"use client";

/* eslint-disable @next/next/no-img-element */
import { FileText, Download } from "lucide-react";
import type { Message } from "@/lib/messaging/messages";

type Props = {
  message: Message;
  isMine: boolean;
  showSender: boolean;
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const EMOJI_ONLY_RE = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u;

function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 12 && EMOJI_ONLY_RE.test(trimmed);
}

export default function MessageBubble({ message, isMine, showSender }: Props) {
  return (
    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} mb-1`}>
      {showSender && (
        <p className="font-sans text-[11px] text-white/40 mb-1 px-1">
          {message.senderName}
        </p>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isMine
            ? "bg-primary text-white rounded-br-sm"
            : "bg-midnight-tidal border border-white/10 text-white rounded-bl-sm"
        }`}
      >
        {message.imageUrl && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img
              src={message.imageUrl}
              alt="Shared image"
              className="max-w-full max-h-64 object-contain rounded-lg"
            />
          </div>
        )}
        {message.fileUrl && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 mb-2 px-3 py-2.5 rounded-lg transition-colors ${
              isMine
                ? "bg-white/10 hover:bg-white/20"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <FileText size={18} className="shrink-0 opacity-70" />
            <span className="font-sans text-xs truncate flex-1">
              {message.fileName ?? "File"}
            </span>
            <Download size={14} className="shrink-0 opacity-60" />
          </a>
        )}
        {message.text && (
          <p className={`whitespace-pre-wrap break-words ${isEmojiOnly(message.text) ? "text-5xl leading-tight" : "font-sans text-sm leading-relaxed"}`}>
            {message.text}
          </p>
        )}
        <p
          className={`font-sans text-[10px] mt-1 ${
            isMine ? "text-white/60 text-right" : "text-white/35"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
