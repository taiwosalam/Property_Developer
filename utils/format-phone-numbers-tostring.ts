export const formatPhoneNumbersToString = (input: any): string => {
  try {
    // Case 1: Input is an array
    if (Array.isArray(input)) {
      return input
        .filter((num) => typeof num === "string" && num.trim())
        .join(", ");
    }

    // Case 2: Input is a stringified JSON array
    if (
      typeof input === "string" &&
      input.startsWith("[") &&
      input.endsWith("]")
    ) {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((num: any) => typeof num === "string" && num.trim())
          .join(", ");
      }
    }

    // Case 3: Input is a single string
    if (typeof input === "string" && input.trim()) {
      return input.trim();
    }

    // Case 4: Fallback for invalid or empty input
    return "";
  } catch (error) {
    console.error("Error formatting phone numbers:", error);
    return "";
  }
};
