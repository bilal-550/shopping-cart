'use strict';

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartList = document.getElementsByClassName('cart-list')[0];
const totalElement = document.getElementById('total');
const purchaseLink = document.getElementById('purchase');
let total;
let cartItems = [];
hideUnhidePurchaseButton();

if (!localStorage['cartItems']) {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
} else {
  cartItems = JSON.parse(localStorage.getItem('cartItems'));
}

if (!localStorage['total']) {
  localStorage.setItem('total', "0");
}

total = parseFloat(localStorage.getItem('total'));
cartItems.forEach(item => {
  const course = JSON.parse(localStorage.getItem(item));
  addToCart(course);
})


addToCartButtons.forEach(button => {
  const courseElement = button.closest('.course');
  button.addEventListener('click', () => {
    const courseInfo = {
      name: `${courseElement.dataset.name} Course`,
      price: `$${courseElement.dataset.price}`
    }
    if (cartItems.includes(courseInfo.name)) {
      alert(`You already added ${courseInfo.name}`)
      return;
    }
    cartItems.push(courseInfo.name);
    localStorage.setItem(courseInfo.name, JSON.stringify(courseInfo));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    addToCart(courseInfo);
  })
})

function addToCart(course) {
  const li = document.createElement('li');
  li.setAttribute('class', 'row list-group-item d-flex justify-content-between align-items-center');

  li.innerHTML = `
  <h4 class="m-0 col-8 col-sm mb-2 mb-sm-0">${course.name}</h4>
  <h3 class="m-0 col">${course.price}</h3>
  <button class="btn btn-danger remove-item px-3 pt-2  col-sm-2 col-xl-1 text-center">Remove</button>
  `;
  cartList.append(li);

  let removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(item => {
    item.addEventListener('click', removeItemFromCart)
  });
  calculateTotal();
  hideUnhidePurchaseButton();
}

function removeItemFromCart(e) {
  const button = e.target;
  button.parentNode.remove();
  const name = button.parentNode.querySelector('h4').innerText;
  cartItems.splice(name, 1);
  localStorage.removeItem(name);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  calculateTotal();
  hideUnhidePurchaseButton();
}

function calculateTotal() {
  const listItems = [...document.querySelectorAll('.cart ul li')];
  total = listItems.reduce((currentTotal, item) => currentTotal + parseFloat(item.querySelector('h3').innerText.substr(1)), 0)
  totalElement.innerHTML = `$${total}`;
  localStorage.setItem('total', total);
}

function hideUnhidePurchaseButton() {
  if (purchaseLink == null) return;
  const cartListItems = document.querySelectorAll('.cart-list li')
  if (cartListItems.length === 0) {
    purchaseLink.remove();
  } else {
    document.querySelector('.cart .container').append(purchaseLink);
  }
}