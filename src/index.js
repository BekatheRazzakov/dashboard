import React from 'react';
import ReactDOM from 'react-dom/client';
import {PersistGate} from "redux-persist/integration/react";
import {persistor, store} from "./app/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {addInterceptors} from "./axiosApi";
import App from "./App";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
addInterceptors(store);

root.render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
