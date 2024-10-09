const NUMBER_FORMAT_LOCALE = "en-NG";

export const formatNumber = (price: number) => {
  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(price);
};

export const formatCostInputValue = (value: string): string => {
  const sanitizedValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except "."
  const unformattedValue = sanitizedValue.replace(/,/g, ""); // Remove commas

  if (unformattedValue.endsWith(".")) {
    return unformattedValue; // If the value ends with ".", return as is
  } else {
    const numericValue = parseFloat(unformattedValue);
    if (!isNaN(numericValue)) {
      return formatNumber(parseFloat(numericValue.toFixed(2))); // Format the number with commas
    } else {
      return "0"; // Return "0" if the value is not a valid number
    }
  }
};

export const currencySymbols = {
  NAIRA: "₦",
  DOLLAR: "$",
  POUND: "£",
} as const;
