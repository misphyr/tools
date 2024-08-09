// src/app/page.tsx


import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-fuchsia-600 p-2 rounded">
        <h1 className="text-2xl font-bold">Bem vindo ao minha Toolbox!</h1>
        <p className="mt-4">Sinta-se livre para usar qualquer ferramenta.</p>
      </div>
    </div>
  );
};

export default HomePage;
