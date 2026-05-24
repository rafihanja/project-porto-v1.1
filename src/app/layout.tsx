import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cek Zakat | Kalkulator Zakat Harian",
  description:
    "Kalkulator sederhana untuk mengecek estimasi zakat penghasilan dan tabungan berdasarkan nisab 2026."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
