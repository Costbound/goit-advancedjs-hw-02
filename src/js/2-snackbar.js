import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form');
const msInput = form.elements.delay;

form.addEventListener('submit', evt => {
  evt.preventDefault();
  const selectedState = form.elements.state.value;
  createPromise(Number(msInput.value), selectedState);
  form.reset();
});

function createPromise(delay, state) {
  if (delay > 0) {
    const promise = new Promise((res, rej) => {
      setTimeout(() => {
        switch (state) {
          case 'fulfilled':
            res(`✅ Fulfilled promise in ${delay}ms`);
            break;
          case 'rejected':
            rej(`❌ Rejected promise in ${delay}ms`);
            break;
          default:
            rej(`[ERROR] Unknown state provided: ${state}`);
            break;
        }
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
