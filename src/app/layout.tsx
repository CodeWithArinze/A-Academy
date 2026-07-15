import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arizon Academy Admissions",
  description: "Admissions and enrollment portal for Arizon Academy."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
