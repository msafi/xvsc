export const formatPrice = (price, { showDollarSign = false, showFree = false, showZeroDecimal = true } = {}) => {
  showDollarSign = !price && showFree ? false : showDollarSign;

  const afterDecimalIsJustZeroes = price && price.toFixed(2) % 1 === 0;
  const showDecimal = !afterDecimalIsJustZeroes || showZeroDecimal;
  const zeroValue = showFree ? "Free" : "0.00";
  const prefix = showDollarSign ? "$" : "";

  return prefix +
    (price ? price.toFixed(showDecimal ? 2 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : zeroValue);
};