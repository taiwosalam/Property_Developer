const NUMBER_FORMAT_LOCALE = "en-NG";

interface FormatNumberOptions {
  forceTwoDecimals?: boolean;
}

export const formatNumber = (
  price: number | string,
  options: FormatNumberOptions = {}
) => {
  const priceNumber = typeof price === "string" ? parseFloat(price) : price;

  const formatOptions = options.forceTwoDecimals
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : {};

  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE, formatOptions).format(
    priceNumber
  );
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
  naira: "₦",
  dollar: "$",
  pound: "£",
} as const;
