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
      <body>
        <div className="flex">
          <Bar />
          <main className="ml-16 mt-[3.5rem] flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
