import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../modules/store";
import { Provider } from "react-redux";
import "../assets/scss/core/core.scss";
import Head from "next/head";

import { configureStore } from '@reduxjs/toolkit';
import analyses from '../../reducers/analyses';

const store = configureStore({
 reducer: { analyses },
});

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Music City</title>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;

