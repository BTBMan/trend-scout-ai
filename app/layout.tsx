/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TrendScout AI - Alpha 趋势星探",
  description:
    "利用 AI 快速评估推文/代币的病毒传播潜力，并将发现永久记录在 Solana 链上",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <Providers>
        <body suppressHydrationWarning className="antialiased">
          {children}
          <Toaster position="top-center" richColors closeButton theme="dark" />
        </body>
      </Providers>
    </html>
  );
}
