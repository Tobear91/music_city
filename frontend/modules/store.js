import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import  analyses from "../reducers/analyses";
import user  from "../reducers/user";
// import {recommandations} from "../reducers/recommandations.js"; // optionnel

const persistConfig = { key: "music_city", storage };
const rootReducer = combineReducers({ user, analyses});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
