import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { GlobalHeader } from "@/components/layout/global-header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan Spec Build Workshop",
  description: "A portfolio showcasing a full AI-assisted product development workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <Suspense fallback={<div className="w-full border-b border-zinc-200 dark:border-zinc-800/60 bg-background mb-header-mb" style={{ minHeight: "89px" }} />}>
              <GlobalHeader />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
