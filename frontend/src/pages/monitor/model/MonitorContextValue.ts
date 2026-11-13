import Department from "../../../shared/types/Department";
import { ISODate } from "../../../shared/types/ISODateStrings";

export type MonitorState = {
  department: Department;
  diaryDate: ISODate;
};

type MonitorContextValue = {
  monitorState: MonitorState;
  setMonitorState: (newMonitorState: MonitorState) => void;
};

export default MonitorContextValue;
