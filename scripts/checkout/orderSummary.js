export { updateCartQuantityHeader };
import {
  cart,
  updateCartQuantity,
  QuantityResult,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import FormatCurrency from "../../Utils/Money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
  CalculateDeliveryOptions
} from "../../data/deliveryOptions.js";
import { paymentSummary } from "./paymentSummary.js";

let container = document.querySelector(".order-summary-js");

function updateCartQuantityHeader() {
  updateCartQuantity();
  let quantityItemCheckout = document.querySelector(".return-to-home-link");
  quantityItemCheckout.innerHTML = `${QuantityResult} items`;
  let payment_summary_row = document.querySelector(".payment-summary-row div");
  payment_summary_row.innerHTML = `Items (${QuantityResult}):`;
}

export function checkoutShowProducts() {
  let MultiContent = "";

  cart.forEach((cartItem, index) => {
    const productId = cartItem.id;

    let matchItem = getProduct(productId);

    let deliveryOptionId = cartItem.deliveryOptionsId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);

    
    let dateString = CalculateDeliveryOptions(deliveryOption);

    MultiContent += `<div class="cart-item-container js-container-${
      cartItem.id
    }">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchItem.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchItem.name}
        </div>
        <div class="product-price">
          $${FormatCurrency(matchItem.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary update-quantity-link-js" data-product-id="${
            cartItem.id
          }">
            Update
          </span>
          <div class="update-box">
          <input type="text" class="quantity-input " data-product-id="${
            cartItem.id
          }">
          <span class="save-quantity-link link-primary" data-product-id="${
            cartItem.id
          }">save</span>
          </div>
          <span class="delete-quantity-link js-delete-quantity-link link-primary
          " data-product-id="${cartItem.id}">
            Delete
          </span>
        </div>
      </div>
      <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${deliveryOptionsHTML(cartItem)}
      </div>
    </div>
  </div>`;
  });
  container.innerHTML = MultiContent;

  function deliveryOptionsHTML(x) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      
      let dateString = CalculateDeliveryOptions(deliveryOption);
      let priceString =
        deliveryOption.priceCent === 0
          ? "Free"
          : `$${FormatCurrency(deliveryOption.priceCent)} -`;
      let isChecked = deliveryOption.id === x.deliveryOptionsId;

      html += `
    <div class="delivery-option js-delivery-option"
    data-product-id="${x.id}" data-delivery-option-id="${deliveryOption.id}">
      <input type="radio" ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${x.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
    </div>
    </div>`;
    });
    return html;
  }

  document.querySelectorAll(".js-delete-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      let productId = link.dataset.productId;

      removeFromCart(productId);
      checkoutShowProducts();
      //   document.querySelector(`.js-container-${productId}`).remove();
      //   updateCartQuantityHeader();
      paymentSummary();
    });
  });
  document.querySelectorAll(".update-quantity-link-js").forEach((updateBTN) => {
    updateBTN.addEventListener("click", () => {
      let productId = updateBTN.dataset.productId;
      let container = document.querySelector(`.js-container-${productId}`);

      if (!container.classList.contains(`is-editing-quantity-${productId}`)) {
        openingUpdateBox(productId);
      } else {
        closingUpdateBox(productId);
      }
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((saveBTN) => {
    saveBTN.addEventListener("click", () => {
      let productId = saveBTN.dataset.productId;
      updateCartQuantityInCheckOut(productId);
      paymentSummary();
    });
  });
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("keydown", () => {
      if (event.key === "Enter") {
        let productId = input.dataset.productId;
        updateCartQuantityInCheckOut(productId);
        paymentSummary();
      }
    });
  });

  function closingUpdateBox(productId) {
    let container = document.querySelector(`.js-container-${productId}`);
    let forStyle = document.querySelector(
      `.is-editing-quantity-${productId} .update-box`
    );
    forStyle.style.display = "none";
    container.classList.remove(`is-editing-quantity-${productId}`);
  }
  function openingUpdateBox(productId) {
    let container = document.querySelector(`.js-container-${productId}`);
    container.classList.add(`is-editing-quantity-${productId}`);
    let forStyle = document.querySelector(
      `.is-editing-quantity-${productId} .update-box`
    );
    forStyle.style.display = "initial";
  }
  function eachItemQunatity(productId) {
    let newItemQuantity = 0;

    cart.forEach((cartItem) => {
      if (cartItem.id === productId) {
        newItemQuantity = cartItem.quantity;
      }
    });
    let container = document.querySelector(
      `.is-editing-quantity-${productId} .quantity-label`
    );

    container.innerHTML = newItemQuantity;
  }
  function updateCartQuantityInCheckOut(productId) {
    let newQuantity = parseInt(
      document.querySelector(
        `.is-editing-quantity-${productId} .update-box input`
      ).value
    );
    if (
      newQuantity === null ||
      newQuantity < 1 ||
      newQuantity > 50 ||
      !newQuantity
    ) {
      alert(
        "the number should not be more than 50 or less than 1, make sure that your number is currect!"
      );
    } else {
      updateQuantity(productId, newQuantity);
      updateCartQuantityHeader();
      eachItemQunatity(productId);
      newQuantity = "";
      closingUpdateBox(productId);
    }
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      checkoutShowProducts();
      paymentSummary();
    });
  });

  
}


