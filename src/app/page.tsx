// src/app/page.tsx
import React from 'react';
import Link from "next/link";

const sections = {
  Utilitários: [
    { title: "Formatar Texto", path: "/utils/caracteres" },
    { title: "Indentador de Arquivo", path: "/utils/indentador" },
    { title: "Gerador Lorem Ipsum", path: "/utils/lorem" },
    { title: "Codificador Base64", path: "/utils/base64" },
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
    <div className="space-y-8 py-8">        {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/40 backdrop-blur-sm">
          <span className="text-blue-300 text-sm font-medium">✨ Ferramentas Desenvolvidas por Misphyr</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent">
          Toolbox
        </h1>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Uma coleção de ferramentas úteis para seu dia a dia. <br/>
          Simples, rápida e eficiente.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="space-y-12">
        {Object.entries(sections).map(([label, items]) => (
          <div key={label} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-1 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full flex-1"></div>
              <h2 className="text-3xl font-bold text-white px-4">{label}</h2>
              <div className="h-1 bg-gradient-to-r from-cyan-400 to-violet-600 rounded-full flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 background-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative card-modern group-hover:transform group-hover:scale-[1.1]">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-10% via-40% to-100% from-cyan-600 via-violet-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white transition-colors duration-300 mb-2">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Clique para acessar esta ferramenta
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-violet-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="text-center pt-16 pb-8">
        <div className="inline-flex items-center space-x-2 text-slate-400">
          <span>Feito com</span>
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>por Misphyr</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
