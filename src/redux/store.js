import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskReducer from "./taskSlice";
import projectReducer from "./projectSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loadingReducer from "./loadingSlice";
import propertiesReducer from "./propertiesSlice";
import viewModeReducer from "./viewModeSlice";
import statusReducer from "./statusSlice"; // ✅ thêm

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ không cần thêm status nếu không cần persist
};

const statusPersistConfig = {
  key: "status",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  task: taskReducer,
  project: projectReducer,
  properties: propertiesReducer,
  viewMode: viewModeReducer,
  status: statusReducer, // ✅ thêm reducer trạng thái
  status: persistReducer(statusPersistConfig, statusReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
