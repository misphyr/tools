"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyComponent from '../components/iconFormatar'
import path from 'path';

const Bar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close the sidebar when navigating
  };

  const avatarUrl = `https://images-ext-1.discordapp.net/external/Xn2lWea_w0aioJbDMrEGMsbvJG_PIfL7W3vVsLDEFPE/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/343957098184572958/a_d70a5bdb058970076a26788c575730c4.gif`;


  const menuNavigation = (
    <nav className="space-y-6">
      <div className="space-y-4">

        {/* Utils Section */}
        <div className="space-y-3 ">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-wider flex items-center space-x-2">
            <div className="h-1 bg-gradient-to-r from-violet-600 to-purple-300 rounded-full flex-1"></div>
            <span>Utilitários</span>
            <div className="h-1 bg-gradient-to-r from-purple-300 to-violet-600 rounded-full flex-1"></div>
          </h2>
          <div className="space-y-2">
            {[
              { path: "/utils/caracteres", title: "Formatar Texto", icon: "📝" },
              { path: "/utils/indentador", title: "Indentador de Arquivo", icon: "📂" },
              { path: "/utils/lorem", title: "Gerador Lorem Ipsum", icon: "📄" },
              { path: "/utils/base64", title: "Codificador Base64", icon: "🔐" }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className="btn-secondary w-full btn-left-align space-x-3 text-left hover:bg-fuchsia-600/20 hover:border-fuchsia-500/50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white text-sm">
                  {item.icon}
                </div>
                <span className="transition-colors duration-300">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generators Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-green-300 uppercase tracking-wider flex items-center space-x-2">
            <div className="h-1 bg-gradient-to-r from-violet-600 to-green-300 rounded-full flex-1"></div>
            <span>Geradores</span>
            <div className="h-1 bg-gradient-to-r from-green-300 to-violet-600 rounded-full flex-1"></div>
          </h2>
          <div className="space-y-2">
            {[
              { path: "/geradores/cpf-cnpj", title: "CPF/CNPJ", icon: "📄" },
              { path: "/geradores/cep", title: "CEP", icon: "📍" },
              { path: "/geradores/cdas", title: "CDAS", icon: "📋" }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className="btn-secondary w-full btn-left-align space-x-3 text-left hover:bg-green-600/20 hover:border-green-500/50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">
                  {item.icon}
                </div>
                <span className="transition-colors duration-300">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Validators Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-orange-300 uppercase tracking-wider flex items-center space-x-2">
            <div className="h-1 bg-gradient-to-r from-violet-600 to-orange-300 rounded-full flex-1"></div>
            <span>Validadores</span>
            <div className="h-1 bg-gradient-to-r from-orange-300 to-violet-600 rounded-full flex-1"></div>
          </h2>
          <div className="space-y-2">
            {[
              { path: "/validadores/cpf-cnpj", title: "CPF/CNPJ", icon: "🔍" },
              { path: "/validadores/cep", title: "CEP", icon: "📍" }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className="btn-secondary w-full flex btn-left-align space-x-3 text-left hover:bg-orange-600/20 hover:border-orange-500/50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm">
                  {item.icon}
                </div>
                <span className="transition-colors duration-300">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <aside className="flex flex-col w-full">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="btn-secondary p-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-6 h-6 ${isOpen ? "rotate-90" : ""} transition-all duration-300 group-hover:scale-110`}
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              onClick={() => navigateTo("/")}
              className="cursor-pointer flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                Toolbox
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-300 font-medium hidden sm:block">Misphyr</span>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-indigo-400 transition-all duration-300"
                style={{
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-md shadow-2xl border-r border-slate-700/50 transform transition-all duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
      >
        <div className="p-6 pt-28 overflow-y-auto h-full">
          {menuNavigation}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </aside>
  );

};

export default Bar;
