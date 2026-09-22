import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { CartProvider } from './CartContext'; // 👈 import CartProvider
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      
        <React.StrictMode>
          <App />
        </React.StrictMode>
      
    </QueryClientProvider>
  </Provider>
);

// reportWebVitals();
