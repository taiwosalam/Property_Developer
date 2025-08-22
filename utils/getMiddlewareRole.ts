import { parse } from 'cookie';

export const getRoleFromCookie = (
  cookieHeader: string | undefined
): string | null => {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  return cookies.role || null;
};
