import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DEFAULT_DEPARTMENT } from "../../../shared/config/config";
import { getDiaryToday } from "../../../shared/lib/getDiaryIsoDate";
import Department from "../../../shared/types/Department";
import { ISODate } from "../../../shared/types/ISODateStrings";

import { MonitorState } from "./MonitorContextValue";

const initialState: MonitorState = {
  department: DEFAULT_DEPARTMENT,
  diaryDate: getDiaryToday(),
};

const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    setDepartmentMonitor: (state: MonitorState, action: PayloadAction<Department>) => {
      state.department = action.payload;
    },
    setDiaryDateMonitor: (state: MonitorState, action: PayloadAction<ISODate>) => {
      state.diaryDate = action.payload;
    },
  },
});

export const { setDepartmentMonitor, setDiaryDateMonitor } = monitorSlice.actions;

export default monitorSlice.reducer;
