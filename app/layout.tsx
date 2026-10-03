import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Pixel Memory ♡", description: "A tiny pixel-art couple memory world." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
