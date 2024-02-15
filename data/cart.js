let local = JSON.parse(localStorage.getItem("cartStorage"));
export let cart = local ? local : [];
export let QuantityResult;
export function updateCartQuantity() {
  let cart_quantity = 0;
  cart.forEach((item) => {
    cart_quantity += item.quantity;
  });
  QuantityResult = cart_quantity;
}

function saveToLocalStorage(x) {
  localStorage.setItem("cartStorage", JSON.stringify(x));
}

export function addToCart(productId, productName, selector) {
  let matchItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchItem = cartItem;
    }
  });
  if (matchItem) {
    matchItem.quantity += selector;
  } else {
    cart.push({
      id: productId,
      Name: productName,
      quantity: selector,
      deliveryOptionsId: "1",
    });
  }
  saveToLocalStorage(cart);
}

export function removeFromCart(productId) {
  const replaceCartArray = [];
  cart.forEach((item) => {
    if (item.id !== productId) {
      replaceCartArray.push(item);
    }
  });
  cart = replaceCartArray;
  saveToLocalStorage(cart);
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.id === productId) {
      cartItem.quantity = newQuantity;
      updateCartQuantity();
    }
  });
  saveToLocalStorage(cart);
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchItem = cartItem;
    }
  });

  matchItem.deliveryOptionsId = deliveryOptionId;
  saveToLocalStorage(cart);
  console.log(cart);
}
