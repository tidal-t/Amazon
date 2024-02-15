export function FormatCurrency(priceCent) {
  return (Math.round(priceCent) / 100).toFixed(2);
}
export default FormatCurrency;
