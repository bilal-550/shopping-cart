const creditCardInput = document.getElementById('credit-card');
const creditCardError = document.getElementById('credit-card-error');
const nameInput = document.getElementById('name');
const nameError = document.getElementById('name-error');
const purchaseButton = document.getElementById('purchase-button');
const acceptedCards = [2222, 1234];


window.onload = () => {
  const cartItems = localStorage.getItem('cartItems');
  if (!cartItems || JSON.parse(cartItems).length === 0) {
    document.querySelectorAll('header, .cart').forEach(element => {
      element.remove();
    })
    const warning = document.createElement('h1');
    warning.innerHTML = 'Please select any courses to continue. <br> <a href="./">Main Page</a>';
    warning.classList.add('text-center')
    document.body.setAttribute('class', 'd-flex justify-content-center align-items-center')
    document.body.append(warning)
  }
}

creditCardInput.oninput = validateCard.bind(null, creditCardInput);
nameInput.oninput = validateName.bind(null, nameInput);



function changeText(el, msg) {
  el.innerHTML = msg;
}

purchaseButton.onclick = () => {
  const creditCardResult = validateCard(creditCardInput), validateNameResult = validateName(nameInput);
  if (creditCardResult && validateNameResult) {
    confirmPurchase();
    alert('Purchase success');
    $('#purchase-modal').modal('hide');
    window.location.assign('./')
  }
}


function validateCard(input) {
  changeText(creditCardError, '');
  if (input.value.trim().length === 0 || input.value == null) {
    changeText(creditCardError, 'Cannot be empty');
    return false;
  };

  const prefix = input.value.trim().length >= 4 ? parseInt(input.value.substr(0, 4)) : null;
  const formatted = input.value.match(/\d{1,4}/g);
  if (formatted == null) {
    changeText(creditCardError, 'Invalid card number');
    return false;
  }
  if (formatted.length > 4) formatted.length = 4;
  input.value = formatted == null ? '' : formatted.join(' ')

  if (prefix && acceptedCards.indexOf(prefix) <= -1) {
    changeText(creditCardError, 'Unsupported card')
    return false;
  } else if (formatted.length < 4) {
    changeText(creditCardError, 'Invalid card number');
    return false;
  } else if (formatted[formatted.length - 1].length !== 4) {
    changeText(creditCardError, 'Invalid card number');
    return false;
  }
  return true;
}

function validateName(input) {
  changeText(nameError, '');
  if (input.value.trim().length === 0 || input.value == null) {
    changeText(nameError, 'Cannot be empty');
    return false;
  } else if (input.value.match(/\d/) != null) {
    console.log('cannot be numbers');
    changeText(nameError, 'Please write a valid name');
  } else if (input.value.trim().length < 9) {
    changeText(nameError, 'Name must be longer than 8 characters');
  }
  return true;
}




$('#purchase-modal').on('hidden.bs.modal', function (e) {
  document.getElementById('purchase-form').reset();
  changeText(creditCardError, '');
  changeText(nameError, '');
})


function confirmPurchase() {
  cartItems.forEach(item => {
    localStorage.removeItem(item);
  })
  cartItems = [];
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  localStorage.setItem('total', 0);
}

