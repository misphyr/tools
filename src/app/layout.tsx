import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toolbox",
  description: "Site por Misphyr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}