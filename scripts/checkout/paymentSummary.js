import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { FormatCurrency } from "../../Utils/Money.js";
import { updateCartQuantityHeader } from "./orderSummary.js";
export function paymentSummary() {
  let totalPrice = 0;
  let totalShippingPrice = 0;
  cart.forEach((cartItem) => {
    let matchProduct = getProduct(cartItem.id);
    totalPrice += matchProduct.priceCents * cartItem.quantity;

    let shippingPrice = getDeliveryOption(cartItem.deliveryOptionsId);
    totalShippingPrice += shippingPrice.priceCent;
  });
  const totalBeforeTaxCents = totalPrice + totalShippingPrice;
  const totalTax = totalBeforeTaxCents * 0.1;
  const finalTotalPrice = totalBeforeTaxCents + totalTax;
  const paymentSummaryHTML = `
  <div class="payment-summary-title">Order Summary</div>

  <div class="payment-summary-row">
    <div></div>
    <div class="payment-summary-money">$${FormatCurrency(totalPrice)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${FormatCurrency(
      totalShippingPrice
    )}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${FormatCurrency(
      totalBeforeTaxCents
    )}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${FormatCurrency(totalTax)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${FormatCurrency(finalTotalPrice)}</div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>`;
  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
  updateCartQuantityHeader();
}
