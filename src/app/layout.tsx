import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "linkDrop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="dark bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
