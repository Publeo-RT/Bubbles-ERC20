import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localfont from "next/font/local"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const bubbles = localfont (
  {
    src: [{
        path: '../public/fonts/BubbleBobble-rg3rx.ttf',
        weight  : '400',
      }],
      variable: "--font-bubbles"
  }
)

export const metadata: Metadata = {
  title: "Bubbles",
  description: "Blub blub blub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bubbles.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
