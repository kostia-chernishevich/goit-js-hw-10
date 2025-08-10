import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
let userSelectedDate = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);


startBtn.addEventListener('click', startTimer);

function startTimer() {
  startBtn.disabled = true;
  dateInput.disabled = true;

  const timerId = setInterval(() => {
    const delta = userSelectedDate - new Date();

    if (delta <= 0) {
      clearInterval(timerId);
      stopTimer();
      dateInput.disabled = false;
      return;
    }

    const time = convertMs(delta);
    updateTimerUI(time);
  }, 1000);
}

function stopTimer() {
  document.querySelector('[data-days]').textContent = '00';
  document.querySelector('[data-hours]').textContent = '00';
  document.querySelector('[data-minutes]').textContent = '00';
  document.querySelector('[data-seconds]').textContent = '00';
}

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}