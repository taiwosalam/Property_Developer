const NUMBER_FORMAT_LOCALE = "en-NG";

export const formatNumber = (price: number) => {
  return new Intl.NumberFormat(NUMBER_FORMAT_LOCALE).format(price);
};

export const currencySymbols = {
  NAIRA: "₦",
};
