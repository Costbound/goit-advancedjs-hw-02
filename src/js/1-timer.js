import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dayOut = document.querySelector('[data-days]');
const hourOut = document.querySelector('[data-hours]');
const minOut = document.querySelector('[data-minutes]');
const secOut = document.querySelector('[data-seconds]');
const startBtn = document.querySelector('button');

let selectedDate;
startBtn.setAttribute('disabled', '');
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose([selectedDates]) {
    if (selectedDates < options.defaultDate) {
      startBtn.setAttribute('disabled', '');
      iziToast.show({
        message: 'Please choose a date in the future',
        backgroundColor: 'rgb(236, 56, 56)',
        messageColor: '#FFF',
        position: 'center',
      });
    } else {
      startBtn.removeAttribute('disabled');
      selectedDate = selectedDates.getTime();
    }
  },
};
const dateInput = flatpickr('#datetime-picker', options);

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
startBtn.onclick = () => {
  if (selectedDate > Date.now()) {
    const calcTimer = () => {
      outputsUpdate(
        [dayOut, hourOut, minOut, secOut],
        convertMs(selectedDate - Date.now())
      );
      if (selectedDate - 1000 < Date.now() && secOut.textContent == '00')
        clearInterval(timer);
    };
    calcTimer();
    const timer = setInterval(calcTimer, 1000);
    dateInput.input.setAttribute('disabled', '');
    startBtn.setAttribute('disabled', '');
    startBtn.dataset.start = 'started';
  } else {
    iziToast.show({
      message: 'Please choose a date in the future',
      backgroundColor: 'rgb(236, 56, 56)',
      messageColor: '#FFF',
      position: 'center',
    });
    startBtn.setAttribute('disabled', '');
  }
};

const outputUpdate = (output, time) => {
  output.textContent = time.toString().padStart(2, '0');
};
const outputsUpdate = (
  [dayOut, hourOut, minOut, secOut],
  { days, hours, minutes, seconds }
) => {
  outputUpdate(dayOut, days);
  outputUpdate(hourOut, hours);
  outputUpdate(minOut, minutes);
  outputUpdate(secOut, seconds);
};
