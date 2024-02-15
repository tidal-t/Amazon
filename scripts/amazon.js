import { updateCartQuantity, addToCart, QuantityResult } from "../data/cart.js";
import { products } from "../data/products.js";
import FormatCurrency from "../Utils/Money.js";
let aaa = document.querySelector(".cart-quantity-js");

updateCartQuantity();
if (QuantityResult === 0) {
  aaa.innerHTML = "";
} else {
  aaa.innerHTML = QuantityResult;
}

let container = document.querySelector(".products-grid");

let adding = "";
products.forEach((product) => {
  adding += `
    <div class="product-container ">
      <div class="product-image-container">
        <img class="product-image"
          src=${product.image}>
      </div>

      <div class="product-name limit-text-to-2-lines">
      ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${FormatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart added-to-cart-js-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}" data-product-name="${product.name}">
        Add to Cart
      </button>
    </div>`;
});
container.innerHTML = adding;

//ابجکت برای ذخیره ایدی تایم اوت هر کالا
const addedMessageTimeouts = {};
function ShowAddedButton(index) {
  //اضافه کردن امکان ویزیبل شدن ادد طوری که اگه یه دکمه رو چند بار زدیم رفرش شه
  //برای هر دکمه هم توی یه ابجکت کلیر تایم اوت مخصوص خودش و ذخیره میکنیک که فقط مال خودش رفرش شه

  let addedIconStyle = document.querySelector(
    `.added-to-cart-js-${products[index].id}`
  );
  addedIconStyle.classList.add("opacity_1");
  if (addedMessageTimeouts[products[index].id]) {
    clearTimeout(addedMessageTimeouts[products[index].id]);
  }
  let timeOutId = setTimeout(() => {
    addedIconStyle.classList.remove("opacity_1");
  }, 2000);
  addedMessageTimeouts[products[index].id] = timeOutId;
  //end
}

let addingToCart = document.querySelectorAll(".js-add-to-cart");
addingToCart.forEach((item, index) => {
  item.addEventListener("click", () => {
    let selector = parseInt(
      document.querySelector(`.js-quantity-selector-${products[index].id}`)
        .value
    );
    ShowAddedButton(index);
    const productName = item.dataset.productName;

    //اول که ایدی پروداکت کلیک شده رو میگیره بعد چک میکنه تو کارت همچین ایدی هست یا نه و اگه بود توی متچ سیوش میکنه

    const productId = item.dataset.productId;
    addToCart(productId, productName, selector);
    //اضافه کردن عدد بالای سبد خرید صفحه اصلی

    updateCartQuantity();
    aaa.innerHTML = QuantityResult;
  });
});
