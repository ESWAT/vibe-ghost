import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Import the registration function

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </StrictMode>
);

// Registering the service worker with a try-catch block for error handling
serviceWorkerRegistration.register()
  .then(() => {
    console.log("Service worker registered successfully.");
  })
  .catch(error => {
    console.error("Error registering service worker:", error);
  });
