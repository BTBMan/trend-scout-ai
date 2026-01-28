/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWalletConnection, useSendTransaction } from "@solana/react-hooks";
import { useEffect, useState } from "react";
import { ScannerInput } from "./components/scanner-input";
import { ViralGauge } from "./components/viral-gauge";
import { StampButton } from "./components/stamp-button";
import { ResultCard } from "./components/result-card";
import { toast } from "sonner";
import { sha256 } from "js-sha256";
import { TransactionInstructionInput } from "@solana/client";
import { ALPHA_STAMP_PROGRAM_ADDRESS } from "./generated/alpha_stamp";
import {
  Address,
  getAddressEncoder,
  getBytesEncoder,
  getProgramDerivedAddress,
} from "@solana/kit";

// Temporary types until API integration
interface AnalysisResult {
  score: number;
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
}

const SYSTEM_PROGRAM_ADDRESS = "11111111111111111111111111111111" as Address;

export default function Home() {
  const { wallet, connect, disconnect, status, connectors } =
    useWalletConnection();
  const { send: sendTransaction, isSending } = useSendTransaction();

  // State
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [pda, setPda] = useState<Address | null>(null);

  // Get wallet address as string
  const walletAddress = wallet?.account.address;

  useEffect(() => {
    async function getPda() {
      if (!walletAddress || !url) {
        setPda(null);
        return;
      }

      const [pda] = await getProgramDerivedAddress({
        programAddress: ALPHA_STAMP_PROGRAM_ADDRESS,
        seeds: [
          getBytesEncoder().encode(Buffer.from("alpha")),
          getAddressEncoder().encode(walletAddress),
          getBytesEncoder().encode(hashUrl(url)),
        ],
      });

      setPda(pda);
    }

    getPda();
  }, [walletAddress, url]);

  function hashUrl(url: string): Uint8Array {
    const hash = sha256(url);
    return new Uint8Array(Buffer.from(hash, "hex"));
  }

  // Analysis Handler
  const handleAnalyze = async (inputUrl: string) => {
    setUrl(inputUrl);
    setIsAnalyzing(true);
    setAnalysis(null);
    setTxSignature(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data);
      toast.success("分析完成！");
    } catch (error) {
      console.error(error);
      toast.error("分析失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Stamp Handler - Using useSendTransaction hook
  const handleStamp = async () => {
    if (!wallet || !analysis) return;

    // Check wallet connection
    if (status !== "connected") {
      toast.error("请先连接钱包");
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { getStampAlphaInstructionDataEncoder } =
        await import("@/app/generated/alpha_stamp/instructions");

      // Create url seed
      const urlSeed = hashUrl(url);

      // Create the instruction with a properly formatted finder
      const instruction: TransactionInstructionInput = {
        programAddress: ALPHA_STAMP_PROGRAM_ADDRESS,
        accounts: [
          { address: walletAddress!, role: 3 },
          { address: pda!, role: 1 },
          { address: SYSTEM_PROGRAM_ADDRESS, role: 0 },
        ],
        data: getStampAlphaInstructionDataEncoder().encode({
          url,
          score: analysis.score,
          urlSeed,
        }),
      };

      // Send transaction using the react-hooks helper
      const signature = await sendTransaction({
        instructions: [instruction],
      });

      setTxSignature(signature);
      toast.success("盖戳成功！已上链存证");
    } catch (error) {
      console.error("Transaction failed:", error);
      // Log the full error details including cause
      if (error && typeof error === "object") {
        console.error(
          "Error details:",
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        );
        if ("cause" in error) {
          console.error("Cause:", (error as any).cause);
        }
        if ("transactionPlanResult" in error) {
          console.error(
            "Transaction plan result:",
            (error as any).transactionPlanResult
          );
        }
      }
      const err = error as Error;
      if (
        err.message?.includes("已经盖戳") ||
        err.message?.includes("already in use")
      ) {
        toast.error("你已经盖戳过这个 URL 了！");
      } else {
        toast.error("交易失败: " + (err.message || "未知错误"));
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background gradients are handled in globals.css via body */}

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
        {/* Header */}
        <header className="w-full max-w-5xl flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary animate-pulse" />
            <span className="text-xl font-heading font-bold tracking-tight text-foreground">
              TrendScout AI
            </span>
          </div>

          {/* Wallet Connect Button */}
          <div>
            {status === "connected" ? (
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 rounded-lg border border-border bg-card/50 hover:bg-card text-sm font-body transition-all"
              >
                {wallet?.account.address.toString().slice(0, 4)}...
                {wallet?.account.address.toString().slice(-4)}
              </button>
            ) : (
              <div className="flex gap-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => connect(connector.id)}
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-sm font-heading font-semibold transition-all"
                  >
                    Connect {connector.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-primary-light to-secondary">
              发现下一个 100x Alpha
            </h1>
            <p className="text-lg md:text-xl text-muted font-body max-w-2xl mx-auto">
              利用 AI 深度分析加密趋势，将你的早期发现永久盖戳上链。
              <br />
              Don&apos;t trust, verify & stamp.
            </p>
          </div>

          {/* Scanner Input */}
          <div className="w-full">
            <ScannerInput
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              disabled={isSending}
            />
          </div>

          {/* Analysis Result Section */}
          {analysis && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ViralGauge
                score={analysis.score}
                reasoning={analysis.reasoning}
                riskLevel={analysis.riskLevel}
                tags={analysis.tags}
              />

              {wallet && (
                <div className="flex justify-center">
                  <StampButton
                    onClick={handleStamp}
                    isStamping={isSending}
                    walletConnected={status === "connected"}
                    hasAnalysis={!!analysis}
                  />
                </div>
              )}
            </div>
          )}

          {/* Transaction Result */}
          {txSignature && analysis && wallet && (
            <div className="w-full animate-in zoom-in duration-500">
              <ResultCard
                finderAddress={wallet.account.address.toString()}
                url={url}
                score={analysis.score}
                timestamp={Date.now() / 1000}
                txSignature={txSignature}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-muted text-sm font-body border-t border-border mt-auto">
        <p>© 2024 TrendScout AI. Built on Solana.</p>
      </footer>
    </div>
  );
}
