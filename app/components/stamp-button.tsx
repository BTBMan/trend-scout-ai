"use client";

import { Loader2, Stamp, Check } from "lucide-react";

interface StampButtonProps {
  onClick: () => void;
  isStamping: boolean;
  isChecking?: boolean;
  isAlreadyStamped?: boolean;
  disabled?: boolean;
  walletConnected: boolean;
  hasAnalysis: boolean;
}

export function StampButton({
  onClick,
  isStamping,
  isChecking = false,
  isAlreadyStamped = false,
  disabled,
  walletConnected,
  hasAnalysis,
}: StampButtonProps) {
  const getButtonState = () => {
    if (!walletConnected) {
      return {
        text: "Connect Wallet",
        icon: null,
        disabled: false,
      };
    }

    if (!hasAnalysis) {
      return {
        text: "Paste URL to Start",
        icon: null,
        disabled: true,
      };
    }

    if (isChecking) {
      return {
        text: "检查盖戳状态...",
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        disabled: true,
      };
    }

    if (isAlreadyStamped) {
      return {
        text: "已盖戳",
        icon: <Check className="w-5 h-5" />,
        disabled: true,
      };
    }

    if (isStamping) {
      return {
        text: "Stamping...",
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        disabled: true,
      };
    }

    return {
      text: "Stamp On-Chain 🔥",
      icon: <Stamp className="w-5 h-5" />,
      disabled: false,
    };
  };

  const state = getButtonState();

  return (
    <button
      onClick={onClick}
      disabled={disabled || state.disabled}
      className="group relative w-full max-w-md mx-auto min-h-15 px-8 py-4 bg-linear-to-r from-secondary to-primary text-background font-heading font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
      aria-label={state.text}
    >
      <span className="flex items-center justify-center gap-3">
        {state.icon}
        {state.text}
      </span>

      {/* Glow effect on hover */}
      {!state.disabled && (
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-secondary/20 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </button>
  );
}
