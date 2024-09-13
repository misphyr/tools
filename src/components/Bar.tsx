"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Bar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
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

  const avatarUrl = `https://cdn.discordapp.com/avatars/343957098184572958/a_6b8c6c1f54ed411854ebc226b7ace836.gif`;


  const menuNavigation = (
    <nav className={`mt-16 transition-all duration-300  ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
      <ul>
        <li className="p-2">
          <h2 className="text-lg font-semibold text-analogousLavender">Geradores</h2>
          <ul>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/geradores/cpf-cnpj')}
                className="w-full px-4 py-2 rounded bg-primaryPurple text-neutralLightGray hover:bg-vibrantPink transition"
              >
                CPF/CNPJ
              </button>
            </li>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/geradores/cep')}
                className="w-full px-4 py-2 rounded bg-primaryPurple text-neutralLightGray hover:bg-vibrantPink transition"
              >
                CEP
              </button>
            </li>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/geradores/cdas')}
                className="w-full px-4 py-2 rounded bg-primaryPurple text-neutralLightGray hover:bg-vibrantPink transition"
              >
                CDAS
              </button>
            </li>
          </ul>
        </li>
        <li className="p-2">
          <h2 className="text-lg font-semibold text-analogousLavender">Validadores</h2>
          <ul>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/validadores/cpf-cnpj')}
                className="w-full px-4 py-2 rounded bg-primaryPurple text-neutralLightGray hover:bg-vibrantPink transition"
              >
                CPF/CNPJ
              </button>
            </li>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/validadores/cep')}
                className="w-full px-4 py-2 rounded bg-primaryPurple  text-neutralLightGray hover:bg-vibrantPink   transition"
              >
                CEP
              </button>
            </li>
          </ul>
        </li>
        <li className="p-2 mt-4">
          <h2 className="text-lg font-semibold text-analogousLavender">Informações</h2>
          <ul>
            <li className="p-2 rounded">
              <button
                onClick={() => navigateTo('/')}
                className="w-full px-4 py-2 rounded bg-primaryPurple text-neutralLightGray hover:bg-vibrantPink transition"
              >
                Sobre
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );


  return (
    <div className="fixed z-40">
      <div className="fixed top-0 left-0 w-full  bg-primaryPurple shadow text-white p-2 flex justify-between items-center transition-all duration-300 z-50">
        <div className="text-xl font-bold ml-4 flex items-center">
          <button
            onClick={toggleSidebar}
            className={`p-2 text-white bg-primaryPurple rounded focus:outline-none hover:bg-vibrantPink`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-8 h-8 ${isOpen ? 'rotate-90' : ''} transition duration-300`}
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="ml-4 underline decoration-neutralDarkGray text-analogousLavender ">Toolbox</span>
        </div>
        <div className="flex items-center mr-4 ">
          <button
            onClick={toggleTheme}
            className="mr-4 no-underline bg-white text-black px-4 py-2 rounded hover:bg-neutralLightGray transition hidden "
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <div className="text-xl font-bold mr-2 underline decoration-neutralDarkGray text-analogousLavender">Misphyr</div>
          <div
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutralDarkGray"
            style={{
              backgroundImage: `url(${avatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>
      <div className={`absolute h-screen w-64 md:w-80 lg:w-96 bg-neutralDarkGray shadow transition-all duration-150 transform 
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} z-40`}
      >
        {menuNavigation}
      </div>


    </div>
  );
};

export default Bar;
