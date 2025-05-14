import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dayOut = document.querySelector('[data-days]');
const hourOut = document.querySelector('[data-hours]');
const minOut = document.querySelector('[data-minutes]');
const secOut = document.querySelector('[data-seconds]');
const startBtn = document.querySelector('[data-start]');

startBtn.setAttribute('disabled', true);

let usersSelectedDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();
    if (isDateInFuture(selectedDate)) {
      usersSelectedDate = selectedDate;
      startBtn.removeAttribute('disabled');
    }
  },
};
const dateInput = flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
  if (!isDateInFuture(usersSelectedDate)) {
    return;
  }
  startBtn.setAttribute('disabled', true);
  dateInput.element.setAttribute('disabled', true);

  const updateTimer = () => {
    const now = Date.now();
    const deltaTime = usersSelectedDate - now;
    const remainMs = Math.ceil(deltaTime / 1000) * 1000;
    if (remainMs <= 0) {
      displayTime();
      return false;
    }
    displayTime(convertMs(remainMs));
    return true;
  };
  updateTimer();
  const msToNextSecond = 1000 - (Date.now() % 1000);
  setTimeout(() => {
    if (!updateTimer()) return;
    const intervalId = setInterval(() => {
      if (!updateTimer()) {
        clearInterval(intervalId);
        dateInput.element.removeAttribute('disabled');
      }
    }, 1000);
  }, msToNextSecond);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function displayTime({ days = 0, hours = 0, minutes = 0, seconds = 0 } = {}) {
  dayOut.textContent = String(days).padStart(2, '0');
  hourOut.textContent = String(hours).padStart(2, '0');
  minOut.textContent = String(minutes).padStart(2, '0');
  secOut.textContent = String(seconds).padStart(2, '0');
}

function isDateInFuture(date) {
  const now = Date.now();
  const isFuture = date > now;
  if (!isFuture) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    startBtn.setAttribute('disabled', true);
  }
  return isFuture;
}
