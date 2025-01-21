import Cookies from 'js-cookie';

export const saveMiddlewareRoleToCookie = async (role: string) => {
  try {
    // Save the role in a cookie (HTTP-only via API route)
    await fetch('/api/set-role-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
  } catch (error) {
    console.error('Error saving role to cookie:', error);
  }
};
