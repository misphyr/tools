
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const Header = () => {
    const avatarUrl = `https://cdn.discordapp.com/avatars/343957098184572958/a_966ba3717fc36728b3b66976aefe2cd8.gif`;

    return (
        <div className="fixed top-0 left-[4rem] w-[calc(100%-4rem)] bg-purple-700 text-white p-4 flex justify-between items-center transition-all duration-300 z-10">
            <div className="text-xl font-bold">
                My Application
            </div>
            <div
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-white"
                style={{
                    backgroundImage: `url(${avatarUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </div>
    );
};

export default Header;

