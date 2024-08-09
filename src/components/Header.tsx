
"use client";

import React from 'react';

const Header = () => {
    const avatarUrl = `https://cdn.discordapp.com/avatars/343957098184572958/a_966ba3717fc36728b3b66976aefe2cd8.gif`;

    return (
        <div className="fixed top-0 left-[4rem] w-[calc(100%-4rem)] bg-fuchsia-600 text-white p-1 flex justify-between items-center transition-all duration-300 z-10">
            <div className="text-xl font-bold">
                Toolbox
            </div>

            <div className="flex items-center">
                <div className="text-xl font-bold mr-2">
                    Misphyr
                </div>
                <div
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                    style={{
                        backgroundImage: `url(${avatarUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>
        </div>
    );
};


export default Header;

