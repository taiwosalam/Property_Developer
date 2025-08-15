export const sanitizeDomainInput = (input: string): string => {
  // Remove any special characters, keep alphanumeric only
  // Remove spaces and other special characters
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "") // Remove spaces entirely
    .replace(/[^a-z0-9]/g, ""); // Keep only alphanumeric
};
