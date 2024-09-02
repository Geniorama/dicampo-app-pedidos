// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // o cualquier otro almacenamiento compatible
import rootReducer from "./rootReducer"; // Asegúrate de que rootReducer esté correctamente definido

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "client"], // Reducers que quieres persistir
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
