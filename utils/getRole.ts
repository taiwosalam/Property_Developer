import Cookies from 'js-cookie';
import { decryptRole } from './session';

/**
 * Retrieve and decrypt the user role from cookies.
 * @returns The decrypted role or `null` if invalid/tampered.
 */
export async function getRoleFromCookie(): Promise<string | null> {
  const encryptedRole = Cookies.get('user_role');
  if (!encryptedRole) return null;

  const role = await decryptRole(encryptedRole);
  
  if (!isValidRole(role)) {
    // Optionally handle the invalid role case, e.g., refresh cookies or return null
    return null; // or handle accordingly
  }
  
  return role;
}

// Function to validate the role
function isValidRole(role: string | null): boolean {
  // Define your validation logic here
  return role !== null && role.length > 0 && role !== "guest"; 
}

