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
import searchReducer from "./reducer/searchReducer";
import AddLoanReducer from "./reducer/AddLoanReducer";

// Create persistConfig for each reducer
const userPersistConfig = {
  key: "user",
  storage: storage,
};

const addUserPersistConfig = {
  key: "addUser",
  storage: storage,
};

const searchPersistConfig = {
  key: "search",
  storage: storage,
};

const persistedReducer = persistReducer(userPersistConfig, UserReducer);
const addUserPersistedReducer = persistReducer(
  addUserPersistConfig,
  AddUserReducer
);
const searchRedu = persistReducer(searchPersistConfig, searchReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    addUser: addUserPersistedReducer,
    search: searchRedu,
    loan: persistReducer({ key: "loan", storage: storage }, AddLoanReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
