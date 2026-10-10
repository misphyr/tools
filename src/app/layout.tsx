import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import Bar from '../components/Bar';

export const metadata: Metadata = {
  title: "misphyr.tools",
  description: "Ferramentas rápidas para o dia a dia de dev e QA: formatadores, geradores e validadores. Por Misphyr.",
};

// Aplica o tema salvo antes da pintura para evitar flash de cores
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <div className="flex flex-col min-h-screen w-full">
          <Bar />
          <main className="flex-1 w-full">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
