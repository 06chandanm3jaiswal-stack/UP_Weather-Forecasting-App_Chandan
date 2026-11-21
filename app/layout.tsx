import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UP Weather | Uttar Pradesh Forecast",
  description: "Current weather and a 7-day forecast for cities across Uttar Pradesh, India."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
