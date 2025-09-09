import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Subscription Box Demo",
  description: "Demo subscription box app — Next.js + Firebase + Stripe (mock)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <Header />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        <footer className="border-t bg-transparent">
          <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-muted-foreground flex justify-between">
            <div>© {new Date().getFullYear()} Subscription Box Demo</div>
            <div>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="mr-4 hover:underline">Home</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/plans" className="hover:underline">Plans</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
