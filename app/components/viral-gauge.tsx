"use client";

import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle, XCircle } from "lucide-react";

interface ViralGaugeProps {
  score: number;
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  tags: string[];
}

export function ViralGauge({
  score,
  reasoning,
  riskLevel,
  tags,
}: ViralGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color and label based on score
  const getScoreColor = () => {
    if (score >= 80)
      return { color: "success", label: "Alpha", icon: TrendingUp };
    if (score >= 41)
      return { color: "warning", label: "Mid", icon: AlertTriangle };
    return { color: "danger", label: "Rekt", icon: XCircle };
  };

  const { color, label, icon: Icon } = getScoreColor();

  // Calculate gauge rotation (semi-circle: -90deg to 90deg)
  const rotation = -90 + (displayScore / 100) * 180;

  return (
    <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
      {/* Gauge visualization */}
      <div className="relative w-64 h-32 mx-auto mb-8">
        {/* Background arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={`var(--${color})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (displayScore / 100) * 251.2}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px var(--${color}))`,
            }}
          />
        </svg>

        {/* Center score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-heading font-bold text-${color}`}>
            {displayScore}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Icon className={`w-5 h-5 text-${color}`} />
            <span
              className={`text-lg font-heading font-semibold text-${color}`}
            >
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="mb-6">
        <h3 className="text-sm font-heading font-semibold text-muted mb-2">
          AI 分析
        </h3>
        <p className="text-foreground font-body leading-relaxed">{reasoning}</p>
      </div>

      {/* Risk Level */}
      <div className="mb-6">
        <h3 className="text-sm font-heading font-semibold text-muted mb-2">
          风险等级
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-body font-medium bg-${color}/20 text-${color} border border-${color}/30`}
          >
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-heading font-semibold text-muted mb-2">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-body bg-border-subtle text-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
