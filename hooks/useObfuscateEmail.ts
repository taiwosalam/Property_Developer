import { useMemo } from 'react';

export const useObfuscatedEmail = (email:string) => {
  const obfuscatedEmail = useMemo(() => {
    const [username, domain] = email.split('@');
    if (username.length <= 4) {
      return `${username}@${domain}`;
    }
    return `${username.slice(0, 4)}****@${domain}`;
  }, [email]);

  return obfuscatedEmail;
};
