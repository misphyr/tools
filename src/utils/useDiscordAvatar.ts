"use client";

import { useEffect, useState } from 'react';

const cacheKey = 'discordAvatar';

// Avatar padrão do Discord, usado quando não há avatar ou a consulta falha
export const defaultDiscordAvatar = (userId: string) =>
  `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(userId) >> BigInt(22)) % BigInt(6))}.png`;

const buildAvatarUrl = (userId: string, avatarHash: string | null, size: number) => {
  if (!avatarHash) return defaultDiscordAvatar(userId);
  const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=${size}`;
};

// Busca o avatar atual via Lanyard (https://github.com/Phineas/lanyard).
// Exige que a conta esteja no servidor do Lanyard no Discord.
export const useDiscordAvatar = (userId: string, size = 128) => {
  const [avatarUrl, setAvatarUrl] = useState(() => defaultDiscordAvatar(userId));

  useEffect(() => {
    // Mostra o último avatar conhecido enquanto consulta o atual
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) setAvatarUrl(cached);
    } catch {
      // armazenamento indisponível: segue só com a consulta
    }

    const controller = new AbortController();
    fetch(`https://api.lanyard.rest/v1/users/${userId}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((body) => {
        if (!body?.success) return;
        const url = buildAvatarUrl(userId, body.data.discord_user.avatar, size);
        setAvatarUrl(url);
        try {
          localStorage.setItem(cacheKey, url);
        } catch {
          // armazenamento indisponível
        }
      })
      .catch(() => {
        // Lanyard fora do ar: mantém o último avatar conhecido
      });
    return () => controller.abort();
  }, [userId, size]);

  return avatarUrl;
};
