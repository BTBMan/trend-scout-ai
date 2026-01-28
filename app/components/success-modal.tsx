"use client";

import { X } from "lucide-react";
import { ResultCard } from "./result-card";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  finderAddress: string;
  url: string;
  score: number;
  timestamp: number;
  txSignature: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  finderAddress,
  url,
  score,
  timestamp,
  txSignature,
}: SuccessModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 w-10 h-10 rounded-full bg-border hover:bg-border-subtle text-foreground flex items-center justify-center transition-colors cursor-pointer"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Result card */}
        <ResultCard
          finderAddress={finderAddress}
          url={url}
          score={score}
          timestamp={timestamp}
          txSignature={txSignature}
        />
      </div>
    </div>
  );
}
