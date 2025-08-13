import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../modules/store";
import { Provider, useSelector } from "react-redux";
import { useRouter } from "next/router";
import "../assets/scss/core/core.scss";
import { useEffect } from "react";
import Head from "next/head";

function AuthGuard({ children }) {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const publicRoutes = ["/", "/connexion", "inscription"];

  useEffect(() => {
    if (!user && !publicRoutes.includes(router.pathname)) {
      router.push("/connexion");
    }
  }, [user, router]);

  return children;
}

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthGuard>
          <Head>
            <title>Music City</title>
          </Head>
          <Component {...pageProps} />
        </AuthGuard>
      </PersistGate>
    </Provider>
  );
}

export default App;
