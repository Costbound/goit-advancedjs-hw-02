import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form');
const msInput = form.elements.delay;
const fullfieldRadio = form.elements.state[0];

form.addEventListener('submit', evt => {
  evt.preventDefault();
  createPromise(Number(msInput.value), fullfieldRadio.checked);
});

function createPromise(delay, shouldResolve) {
  if (delay > 0) {
    const promise = new Promise((res, rej) => {
      setTimeout(() => {
        if (shouldResolve) res(`✅ Fulfilled promise in ${delay}ms`);
        else rej(`❌ Rejected promise in ${delay}ms`);
      }, delay);
    });
    promise
      .then(value => {
        iziToast.show({
          message: value,
          backgroundColor: 'rgba(82, 223, 79, 0.3)',
          position: 'topRight',
        });
      })
      .catch(value => {
        iziToast.show({
          message: value,
          backgroundColor: 'rgba(223, 79, 79, 0.3)',
          position: 'topRight',
        });
      });
  } else {
    iziToast.show({
      message: 'Value must be more than 0',
      backgroundColor: 'yellow',
      position: 'topRight',
    });
  }
}
