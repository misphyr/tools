// src/app/page.tsx


import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex">
      <div className="ml-16 p-8 flex-grow">
        <h1 className="text-2xl font-bold">Welcome to the Main Page</h1>
        <p className="mt-4">This is the content area.</p>
      </div>
    </div>
  );
};

export default HomePage;
