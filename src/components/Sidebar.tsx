
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateToGenerator = () => {
    router.push('/cpf-cnpj-generator');

    toggleSidebar();
  };

  const navigateToHome = () => {
    router.push('/');

    toggleSidebar();
  };

  const menuBtn = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-8 ${isOpen ? "" : "rotate-90"}`} // Conditional class name
    >
      <path
        fillRule="evenodd"
        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className={`fixed top-0 left-0 bg-purple-700 text-white h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} z-20`}>
      <button onClick={toggleSidebar} className="p-2 m-2 text-white bg-purple-900 rounded focus:outline-none">
        {menuBtn}

      </button>
      <nav className={`${isOpen ? 'block' : 'hidden'} mt-4`}>
        <ul>
          <li className="p-2 hover:bg-purple-600">
            <button onClick={navigateToHome}>
              Home
            </button></li>
          <li className="p-2 hover:bg-purple-600">
            <button onClick={navigateToGenerator}>
              CPF/CNPJ Generator
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
