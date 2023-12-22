import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

function showAlert(message) {
  let alertBox = document.querySelector('.custom-alert');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.classList.add('custom-alert');
    document.body.appendChild(alertBox);
  }

  alertBox.textContent = message;
  alertBox.classList.add('show'); // Adding the 'show' class

  setTimeout(function () {
    alertBox.classList.remove('show'); // Removing the 'show' class, hiding the alert
  }, 3000);
}

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.element = element;

    thisBooking.selectedTable = null; // Added property to store information about the selected table

    thisBooking.render();
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      bookings: settings.db.url + '/' + settings.db.bookings
        + '?' + params.bookings.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.events
        + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponse) {
        const bookingResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);

      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      // console.log('loop', hourBlock);

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }

    // Resetting the table selection
    this.resetTableSelection();
  }

  resetTableSelection() {
    const thisBooking = this;
    const selectedTableElement = thisBooking.dom.floorPlan.querySelector('.table.selected');
    if (selectedTableElement) {
      selectedTableElement.classList.remove('selected');
    }
    thisBooking.selectedTable = null;
  }

  render() {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {}; // Create an empty object thisBooking.dom
    thisBooking.dom.wrapper = thisBooking.element; // Assign a reference to the container
    thisBooking.dom.wrapper.innerHTML = generatedHTML; // Change the wrapper content
    // Adding references to inputs
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector('.floor-plan'); // Access to the div with tables

    // Dodanie odniesień do elementów formularza
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters); // Dodanie odniesienia do checkboxów starters
    console.log(thisBooking.dom.form);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

    thisBooking.dom.floorPlan.addEventListener('click', function (event) {
      thisBooking.initTables(event);
    });

    // Adding event listeners to widgets to reset table selection on their change
    thisBooking.dom.datePicker.addEventListener('change', function () {
      thisBooking.updateDOM();
    });
    thisBooking.dom.hourPicker.addEventListener('change', function () {
      thisBooking.updateDOM();
    });
    thisBooking.peopleAmountWidget.dom.input.addEventListener('change', function () {
      thisBooking.updateDOM();
    });
    thisBooking.hoursAmountWidget.dom.input.addEventListener('change', function () {
      thisBooking.updateDOM();
    });
  }

  initTables(event) {
    const thisBooking = this;
    const clickedElement = event.target;

    if (clickedElement.classList.contains('table')) {
      if (clickedElement.classList.contains('booked')) {
        // Displaying an alert if the table is already booked
        showAlert('This table is already booked!');
      } else {
        const tableId = clickedElement.getAttribute(settings.booking.tableIdAttribute);

        const previouslySelectedTable = thisBooking.dom.floorPlan.querySelector('.table.selected');
        if (previouslySelectedTable) {
          previouslySelectedTable.classList.remove('selected');
        }

        if (thisBooking.selectedTable !== tableId) {
          clickedElement.classList.add('selected');
          thisBooking.selectedTable = tableId;
        } else {
          thisBooking.selectedTable = null;
        }
      }
    }
  }

  initActions() {
    const thisBooking = this;
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);

    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });

    console.log(thisBooking.dom.form);
  }

  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.bookings;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: parseInt(thisBooking.selectedTable) || null,
      duration: parseInt(thisBooking.hoursAmountWidget.value),
      ppl: parseInt(thisBooking.peopleAmountWidget.value),
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
      starters: [],
    };

    // Wypełnianie tablicy starters na podstawie zaznaczonych opcji
    const starterCheckboxes = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    starterCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        payload.starters.push(checkbox.value);
      }
    });

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
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
        thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
      });
  }

  getStarters() {
    const thisBooking = this;
    const starters = [];

    const starterCheckboxes = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    starterCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        starters.push(checkbox.value);
      }
    });

    return starters;
  }
}

export default Booking;