import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import user from "../reducers/user";
import blindtest from "../reducers/blindtest";
import analyses from "../reducers/analyses";
import discogs from "../reducers/discogs";
import character from "../reducers/character"

const persistConfig = { key: "music_city", storage };
const rootReducer = combineReducers({ user, analyses, blindtest, discogs,character });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
