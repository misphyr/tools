// src/app/page.tsx


import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-vibrantPink p-2 rounded">
        <h1 className="text-2xl text-analogousLavender font-bold">Bem vindo a minha Toolbox!</h1>
        <p className="mt-4 text-neutralLightGray">Sinta-se livre para usar qualquer ferramenta.</p>
      </div>
    </div>
  );
};

export default HomePage;
