export const formatPrice = (price, { showDollarSign = false } = {}) => {
  showDollarSign = !price ? false : showDollarSign;

  const afterDecimalIsJustZeroes = price && price.toFixed(2) % 1 === 0;
  const showDecimal = !afterDecimalIsJustZeroes;
  const zeroValue = showDecimal ? "Free" : "0.00";

  return price ? price.toFixed(showDecimal ? 2 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : zeroValue;
};