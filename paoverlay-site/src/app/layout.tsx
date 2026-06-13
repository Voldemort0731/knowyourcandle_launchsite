import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAoverlay Pattern Library",
  description: "A draggable display of 23 live candlestick patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090c0f] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
