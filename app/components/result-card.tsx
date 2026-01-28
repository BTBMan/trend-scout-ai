"use client";

import { ExternalLink, Copy, Check, X } from "lucide-react";
import { useState } from "react";

interface ResultCardProps {
  finderAddress: string;
  url: string;
  score: number;
  timestamp: number;
  txSignature: string;
}

export function ResultCard({
  finderAddress,
  url,
  score,
  timestamp,
  txSignature,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyTx = async () => {
    await navigator.clipboard.writeText(txSignature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `我在 TrendScout AI 上发现了一个 Alpha！爆火指数：${score}/100 🔥\n\n查看链上证明：`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`https://solscan.io/tx/${txSignature}?cluster=devnet`)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-2xl mx-auto glow-success">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          盖戳成功！
        </h2>
        <p className="text-muted font-body">
          你的 Alpha 发现已永久记录在 Solana 链上
        </p>
      </div>

      {/* Data grid */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <span className="text-sm font-heading text-muted">发现者</span>
          <span className="text-sm font-mono text-foreground">
            {formatAddress(finderAddress)}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm font-heading text-muted">URL</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-body text-primary hover:text-primary-light transition-colors flex items-center gap-1 cursor-pointer"
          >
            {url.length > 30 ? `${url.slice(0, 30)}...` : url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm font-heading text-muted">爆火指数</span>
          <span className="text-sm font-heading font-bold text-success">
            {score}/100
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm font-heading text-muted">时间</span>
          <span className="text-sm font-body text-foreground">
            {formatDate(timestamp)}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm font-heading text-muted">交易签名</span>
          <button
            onClick={handleCopyTx}
            className="text-sm font-mono text-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            aria-label="复制交易签名"
          >
            {formatAddress(txSignature)}
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <a
          href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-3 bg-border-subtle hover:bg-border text-foreground font-body font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          查看链上记录
        </a>
        <button
          onClick={handleShareTwitter}
          className="flex-1 px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-body font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          aria-label="分享到 Twitter"
        >
          <X className="w-4 h-4" />
          分享到 X
        </button>
      </div>
    </div>
  );
}
