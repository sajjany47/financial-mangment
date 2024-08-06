import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducer/UserReducer";
import storage from "redux-persist/lib/storage/session";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AddUserReducer from "./reducer/AddUserReducer";

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, UserReducer);
const addUserPersistedReducer = persistReducer(persistConfig, AddUserReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    addUser: addUserPersistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(),
});
