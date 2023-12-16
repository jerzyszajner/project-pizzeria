import { settings, select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    //console.log('adding product', menuProduct);

    // Use the template
    const generatedHTML = templates.cartProduct(menuProduct);
    // Convert HTML string to a DOM element
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // Add the DOM element to the product list in the cart
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  update() {
    const thisCart = this;
    // Retrieval of the delivery charge from settings
    const deliveryFee = settings.cart.defaultDeliveryFee;

    // Initialization of the total number of products in the cart
    thisCart.totalNumber = 0;
    // Initialization of the sum of product prices (excluding delivery costs)
    thisCart.subtotalPrice = 0;

    // Loop through all products in the cart
    for (let product of thisCart.products) {
      // Increase totalNumber by the quantity of each product
      thisCart.totalNumber += product.amount;
      // Increase subtotalPrice by the total price of each product
      thisCart.subtotalPrice += product.price;
    }

    // Check if there are any products in the cart
    if (thisCart.totalNumber > 0) {
      // If there are products, add the delivery cost
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    } else {
      // If there are no products, the total price is 0
      thisCart.deliveryFee = 0;
    }

    // Calculation of the total amount
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    // Update HTML elements of the cart
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalPrice.forEach(elem => elem.innerHTML = thisCart.totalPrice);
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

    // Display information in the console
    console.log('Delivery fee:', deliveryFee);
    console.log('Total number of items:', thisCart.totalNumber);
    console.log('Subtotal price:', thisCart.subtotalPrice);
    console.log('Total price:', thisCart.totalPrice);
  }

  remove(cartProduct) {
    const thisCart = this;

    // Remove the HTML representation of the product from the cart
    cartProduct.dom.wrapper.remove();

    // Find the index of the product in the thisCart.products array
    const index = thisCart.products.indexOf(cartProduct);
    if (index !== -1) {
      // Remove the product from the array
      thisCart.products.splice(index, 1);
    }

    // Call the update method to recalculate totals
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;


    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    console.log('payload', payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;