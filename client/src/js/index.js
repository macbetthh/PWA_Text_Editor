import { Workbox } from 'workbox-window';
import Editor from './editor';
import { getDb, putDb } from './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
} else {
  // Load data from IndexedDB and set it to the editor
  window.addEventListener('load', async () => {
    const data = await getDb();
    if (data.length > 0) {
      editor.setValue(data[0].value); // Assuming editor has a setValue method
    }

    // Save data to IndexedDB on input
    editor.on('change', async (content) => {
      await putDb(content);
    });
  });
}

// Register service worker using Workbox
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js');
  wb.register()
    .then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
}
