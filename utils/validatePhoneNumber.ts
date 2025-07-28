import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const validateAndCleanPhoneNumber = (phoneNumber: string): string | null => {
  // Return null if phoneNumber is empty or undefined
  if (!phoneNumber) {
    return null;
  }

  try {
    // Parse the phone number
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);

    // Check if the number is valid and not just a country code
    if (!parsedNumber || !parsedNumber.isValid()) {
      return null;
    }

    // Ensure the number has sufficient digits (more than just country code)
    // Typical country codes are 1-4 digits, so we check for at least 7 digits total
    const numberLength = parsedNumber.number.replace(/[^0-9]/g, '').length;
    const countryCodeLength = parsedNumber.countryCallingCode.length;
    if (numberLength <= countryCodeLength + 3) {
      return null;
    }

    // Return the cleaned E.164 format number (e.g., +2341234567890)
    return parsedNumber.format('E.164');
  } catch (error) {
    console.error('Error validating phone number:', error);
    return null;
  }
};