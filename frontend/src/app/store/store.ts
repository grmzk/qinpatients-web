import { configureStore } from "@reduxjs/toolkit";

import { editorReducer } from "../../features/editor/model";
import { monitorReducer } from "../../pages/monitor/model";

const store = configureStore({
  reducer: {
    monitor: monitorReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
