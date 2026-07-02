import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChromeShell } from "@/components/ChromeShell";

export const metadata: Metadata = {
  title: "Ztor — Watch Party",
  description: "Watch together in sync — live comments and presence.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ChromeShell>{children}</ChromeShell>
      </body>
    </html>
  );
}
