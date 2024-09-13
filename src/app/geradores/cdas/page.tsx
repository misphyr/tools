"use client"
import React, { useState } from 'react';
import { downloadJson } from '../../../utils/downloadJson';
import { cdaGenerator } from '../../../utils/cdaGenerator';



const JsonGenerator: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const handleDownload = () => {
    const data = cdaGenerator();

    downloadJson(data, 'meu-json'); // Gera o arquivo com o nome 'meu-json.json'
  }; 

  const showTemporaryMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-neutralDarkGray p-8 rounded-lg shadow-lg w-full max-w-lg outline outline-vibrantPink rounded">
        <h1 className="text-2xl font-bold text-analogousLavender">Gerador de Cda</h1>
        <p className="mt-4 text-neutralLightGray">Gera uma cda com os parâmetros indicados</p>
        <p className="mt-4 text-neutralLightGray">Em Construção...</p>


        <div className="mt-6 flex space-x-4">
          
          <button
            onClick={handleDownload}
            className="bg-primaryPurple text-neutralLightGray px-4 py-2 rounded hover:bg-vibrantPink transition"
          >
            Baixar Cda
          </button>
        </div>
      </div>
      {message && (
        <div className="fixed bottom-4 left-1/2 transform animate-bounce duration-5000 -translate-x-1/2 bg-neutralDarkGray text-analogousLavender px-4 py-2 rounded shadow-lg outline outline-vibrantPink">
          {message}
        </div>
      )}
    </div>
  );
};

export default JsonGenerator;
