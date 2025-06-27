import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Bar from '../components/Bar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toolbox",
  description: "Site por Misphyr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col h-screen w-full">
          <Bar />
          <main className="flex-1 flex justify-center items-start overflow-y-auto">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
