export const cleanPricingValue = (value: string): string => {
    // Remove currency symbol (₦) and commas, but keep digits and decimal point
    let cleaned = value.replace(/[₦,]/g, "");
    // Ensure the output is a valid decimal number (e.g., "10.00" or "10")
    const num = parseFloat(cleaned);
    // Return as string with two decimal places for consistency
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };
    