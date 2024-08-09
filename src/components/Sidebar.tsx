"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateToCpfGenerator = () => {
    router.push('/cpf-cnpj-generator');

    toggleSidebar();
  };

  const navigateToCepGenerator = () => {
    router.push('/cep-generator');

    toggleSidebar();
  };
  
  const navigateToCpfValidator = () => {
    router.push('/cpf-cnpj-validator');

    toggleSidebar();
  };
  const navigateToCepValidator = () => {
    router.push('/cep-validator');

    toggleSidebar();
  };

  const navigateToHome = () => {
    router.push('/');

    toggleSidebar();
  };

  
  // hidden md:block 
  return (
    <div className={`fixed top-0 left-0 text-white h-full duration-150 z-20  ${isOpen ? 'w-64 bg-gray-800' : 'w-16 bg-fuchsia-600'} `}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 m-2 text-white ${isOpen ? 'bg-gray-800' : 'bg-fuchsia-600'}  rounded focus:outline-none`}
        >
           <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-8 ${isOpen ? "rotate-90" : ""} transition-transform duration-200`}
    >
      <path
        fillRule="evenodd"
        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
        </button>
        {isOpen && (
          <div className="ml-4">
            <h2 className="text-white text-lg font-semibold">Menu</h2>
          </div>
        )}
      </div>
      <nav className={`${isOpen ? 'block' : 'hidden'} mt-4`}>
        <ul>
          <li className="p-2">
            <h2 className="text-lg font-semibold text-teal-500">+ Geradores</h2>
            <ul>
              <li className="p-2 rounded">
                <button
                  onClick={navigateToCpfGenerator}
                  className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
                >
                  CPF/CNPJ
                </button>
              </li>
              <li className="p-2 rounded">
                <button
                  onClick={navigateToCepGenerator}
                  className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
                >
                  CEP
                </button>
              </li>
            </ul>
          </li>
          <li className="p-2">
            <h2 className="text-lg font-semibold text-teal-500">+ Validadores</h2>
            <ul>
              <li className="p-2 rounded">
                <button
                  onClick={navigateToCpfValidator}
                  className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
                >
                  CPF/CNPJ
                </button>
              </li>
              <li className="p-2 rounded">
                <button
                  onClick={navigateToCepValidator}
                  className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
                >
                  CEP
                </button>
              </li>
            </ul>
          </li>
          <li className="p-2 mt-4">
            <h2 className="text-lg font-semibold text-teal-500">+ Informações</h2>
            <ul>
              <li className="p-2 rounded">
                <button
                  onClick={navigateToHome}
                  className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-teal-500 transition"
                >
                  Sobre
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
