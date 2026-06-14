import type { Metadata } from "next";
import "./globals.css";
import { GoogleProvider } from "@/components/google-provider";
import { AuthProvider } from "@/components/auth-provider";

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
        <GoogleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
