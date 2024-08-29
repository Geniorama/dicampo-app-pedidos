import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import clientSlice from "./features/clientSlice";
import cartSlice from "./features/cartSlice";

// Configuración de persistencia para el cliente
const persistClientConfig = {
  key: 'client', // Clave única para el estado del cliente
  storage,
};

// Configuración de persistencia para el carrito
const persistCartConfig = {
  key: 'cart', // Clave única para el estado del carrito
  storage,
};

// Reducers persistidos
const persistedClientReducer = persistReducer(persistClientConfig, clientSlice);
const persistedCartReducer = persistReducer(persistCartConfig, cartSlice);

export const makeStore = () => {
  return configureStore({
    reducer: {
        client: persistedClientReducer,
        cart: persistedCartReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones relacionadas con redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register", "rehydrate"],
      },
    })
  });
};

export const persistor = persistStore(makeStore());

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
