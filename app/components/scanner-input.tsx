"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface ScannerInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export function ScannerInput({
  onAnalyze,
  isAnalyzing,
  disabled,
}: ScannerInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string): boolean => {
    try {
      const urlObj = new URL(input);
      const validDomains = ["trends.fun", "twitter.com", "x.com"];
      return validDomains.some((domain) => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("请输入 URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("请输入有效的 Trends.fun 或 Twitter URL");
      return;
    }

    onAnalyze(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Animated border container */}
        <div className="relative animated-border rounded-2xl">
          <div className="glass rounded-2xl p-1">
            <div className="flex items-center gap-3 bg-background/50 rounded-xl p-4">
              <Search className="w-6 h-6 text-primary shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                placeholder="粘贴 Trends.fun 或 Twitter 链接检测 Alpha..."
                disabled={disabled || isAnalyzing}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted outline-none text-lg font-body disabled:opacity-50"
                aria-label="URL 输入框"
              />
              <button
                type="submit"
                disabled={disabled || isAnalyzing || !url.trim()}
                className="px-6 py-2.5 bg-linear-to-r from-primary to-primary-light text-background font-heading font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="分析"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    扫描中...
                  </span>
                ) : (
                  "分析"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-danger font-body ml-4" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Helper text */}
      <p className="mt-4 text-center text-sm text-muted font-body">
        支持 Trends.fun 和 Twitter/X 链接
      </p>
    </form>
  );
}
