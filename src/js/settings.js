export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget', // CODE ADDED
    homeWidget: '#template-home-widget', // CODE ADDED
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages', // CODE ADDED
    booking: '.booking-wrapper', // CODE ADDED
    home: '.home-wrapper', // CODE ADDED
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: { // CODE ADDED
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: { // CODE ADDED
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },

  },
  booking: { // CODE ADDED
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    form: '.booking-form',
    starters: '[name="starter"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  nav: { // CODE ADDED
    links: '.main-nav a',
  },
  home: { // CODE ADDED
    order: '.order-online',
    book: '.book-table',
    options: '.options a',
    carousel: '.main-carousel',
  },

  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
  booking: { // CODE ADDED
    loading: 'loading',
    tableBooked: 'booked',
  },
  nav: { // CODE ADDED
    active: 'active',
  },
  pages: { // CODE ADDED
    active: 'active',
  },
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  hours: { // CODE ADDED
    open: 12,
    close: 24,
  },
  datePicker: { // CODE ADDED
    maxDaysInFuture: 14,
  },
  booking: { // CODE ADDED
    tableIdAttribute: 'data-table',
  },
  db: { // CODE UPDATED
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    bookings: 'bookings', // CODE ADDED
    events: 'events', // CODE ADDED
    dateStartParamKey: 'date_gte', // CODE ADDED
    dateEndParamKey: 'date_lte', // CODE ADDED
    notRepeatParam: 'repeat=false', // CODE ADDED
    repeatParam: 'repeat_ne=false', // CODE ADDED
  },
};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML), // CODE ADDED
  homeWidget: Handlebars.compile(document.querySelector(select.templateOf.homeWidget).innerHTML), // CODE ADDED
};