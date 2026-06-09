(function() {
  try {
    var targetObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    if (targetObj) {
      var originalFetch = targetObj.fetch;
      var currentFetch = originalFetch;
      var patch = function(obj: any) {
        if (!obj) return;
        try {
          Object.defineProperty(obj, 'fetch', {
            get: function() { return currentFetch; },
            set: function(val) { currentFetch = val; },
            configurable: true,
            enumerable: true
          });
        } catch (e) {}
      };
      patch(window);
      if (typeof globalThis !== 'undefined') patch(globalThis);
      if (typeof global !== 'undefined') patch(global);
    }
  } catch (e) {}
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
