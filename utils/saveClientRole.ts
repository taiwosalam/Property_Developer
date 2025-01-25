import Cookies from 'js-cookie';
import { encryptRole } from './session';

/**
 * Save the user role in a cookie securely after encrypting it.
 * @param role - The role to save (e.g., 'admin', 'user').
 */
export async function saveClientRoleToCookie(role: string): Promise<void> {
  const encryptedRole = await encryptRole(role);

  // Store the encrypted role in a cookie
  Cookies.set('user_role', encryptedRole, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Accessible on the client-side
    sameSite: 'strict',
    expires: 7, // Optional: Expire in 7 days
  });
}
