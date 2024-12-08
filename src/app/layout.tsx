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
    <html lang="en">
      <body className="h-screen ">
        <div className="flex flex-col gap-1 h-full w-full overflow-hidden">
          <Bar />
          <main className="flex justify-center items-center h-full w-full z-20 overflow-y-auto overflow-visible">
            {children}
            </main>
        </div>
      </body>
    </html>
  );
}
