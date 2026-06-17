import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAMU CS Degree Planner",
  description: "Plan your BS Computer Science path at Alabama A&M University",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
