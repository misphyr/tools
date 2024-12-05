// src/app/page.tsx


import React from 'react';
import Link from "next/link";

const sections = {
  Utils: [
    { title: "Formatar Texto", path: "/utils/caracteres" },
  ],
  Geradores: [
    { title: "Gerar CPF/CNPJ", path: "/geradores/cpf-cnpj" },
    { title: "Gerar CEP", path: "/geradores/cep" },
    { title: "Gerar CDAS", path: "/geradores/cdas" },
  ],
  Validadores: [
    { title: "Validar CPF/CNPJ", path: "/validadores/cpf-cnpj" },
    { title: "Validar CEP", path: "/validadores/cep" },
  ],
};

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-7xl mb-8 border border-vibrantPink">
        <h1 className="text-3xl text-analogousLavender font-bold text-center mb-8">
          Bem-vindo(a) à minha Toolbox!
        </h1>
        <p className="text-neutralLightGray text-center">
          Sinta-se livre para usar qualquer ferramenta.
        </p>
        </div>
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-7xl border border-analogousMagenta">
        {Object.entries(sections).map(([label, items]) => (
          <div key={label} className="mb-8">
            <h2 className="text-2xl font-bold underline text-complementaryTeal mb-4">{label}___</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block bg-primaryPurple p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-vibrantPink transition"
                >
                  <h3 className="text-lg font-bold text-analogousLavender">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
