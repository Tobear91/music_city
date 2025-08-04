import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../modules/store";
import { Provider } from "react-redux";
import "../styles/globals.css";
import Head from "next/head";

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
