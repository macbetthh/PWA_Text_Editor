import { Workbox } from 'workbox-window';
import Editor from './editor';
import { getDb, putDb } from './database'; // Import getDb and putDb
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
      editor.setValue(data[0].content);
    }

    // Save data to IndexedDB on input
    editor.on('change', async () => {
      const content = editor.editor.getValue();
      await putDb(content);
    });
  });
}

// Re-enable service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
