import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.element = element;
    thisBooking.render();
    thisBooking.initWidgets();
  }

  render() {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {}; // Create an empty object thisBooking.dom
    thisBooking.dom.wrapper = thisBooking.element; // Assign a reference to the container
    thisBooking.dom.wrapper.innerHTML = generatedHTML; // Change the wrapper content
    // Dodawanie referencji do inputów
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.peopleAmount.addEventListener('updated', function() {
      // Here I will add logic to be executed after changing the number of people
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function() {
      // Here I will add logic to be executed after changing the number of hours
    });
  }
}

export default Booking;