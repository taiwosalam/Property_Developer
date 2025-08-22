function obfuscateEmail(email?: string) {
  if (!email) return "";
  const [localPart, domain] = email.split("@");

  if (localPart.length <= 3) {
    // If the local part is too short, obfuscate the entire local part
    return `${"*".repeat(localPart.length)}@${domain}`;
  }

  const visiblePart = localPart.slice(0, 3);
  const obfuscatedPart = "****";

  return `${visiblePart}${obfuscatedPart}@${domain}`;
}

export default obfuscateEmail;
