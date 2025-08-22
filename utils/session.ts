import { sealData, unsealData } from 'iron-session';
const SECRET =
  process.env.NEXT_PUBLIC_SESSION_SESSION ||
  '82ca21ceec0a10e94f43ad351a50d7ef';

/**
 * Encrypt data (e.g., user role) for secure storage.
 * @param data - The data to encrypt (e.g., a role string).
 * @returns A sealed/encrypted string.
 */
export async function encryptRole(data: string): Promise<string> {
  const encrypted = await sealData(data, { password: SECRET });
  return encrypted;
}

/**
 * Decrypt encrypted data to retrieve its original value.
 * @param encryptedData - The sealed/encrypted data.
 * @returns The original value or `null` if decryption fails.
 */
export async function decryptRole(
  encryptedData: string
): Promise<string | null> {
  try {
    const data = await unsealData<string>(encryptedData, { password: SECRET });
    return data;
  } catch (error) {
    return null; // Return null if decryption fails (e.g., tampered data)
  }
}
