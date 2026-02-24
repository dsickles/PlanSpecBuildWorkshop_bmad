import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalHeader } from "@/components/layout/global-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan. Spec. Build. Workshop",
  description: "A portfolio showcasing a full AI-assisted product development workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <GlobalHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
