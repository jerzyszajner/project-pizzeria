import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';


class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;

    // Assign properties from the menuProduct to this cart product.
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = menuProduct.params;
    thisCartProduct.priceSingle = menuProduct.priceSingle;


    // Initialize DOM elements.
    thisCartProduct.getElements(element);
    // Initialize Amount Widget
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    //console.log('CartProduct', thisCartProduct);
  }

  getElements(element) {
    const thisCartProduct = this;

    // Create an empty object to store DOM references.
    thisCartProduct.dom = {};
    // Assign the main wrapper element.
    thisCartProduct.dom.wrapper = element;

    // Find and assign sub-elements within the wrapper.
    thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
    thisCartProduct.dom.amountWidgetElem = element.querySelector(select.cartProduct.amountWidget);
  }

  initAmountWidget() {
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);

    thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function () {
      // Update quantity
      thisCartProduct.amount = thisCartProduct.amountWidget.value;

      // Calculate new price
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;

      // Update price in HTML
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  remove() {
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });

    thisCartProduct.dom.wrapper.dispatchEvent(event);
    console.log('Removing product:', thisCartProduct);
  }

  initActions() {
    const thisCartProduct = this;

    // Add listener for the edit button
    thisCartProduct.dom.edit.addEventListener('click', function (event) {
      event.preventDefault();

    });

    // Add listener for the delete button
    thisCartProduct.dom.remove.addEventListener('click', function (event) {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData() {
    const thisCartProduct = this;

    const productData = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      amount: thisCartProduct.amount,
      priceSingle: thisCartProduct.priceSingle,
      price: thisCartProduct.price,
      params: thisCartProduct.params
    };

    return productData;
  }
}

export default CartProduct;