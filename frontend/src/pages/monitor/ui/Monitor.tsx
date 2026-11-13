import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import Department from "../../../shared/types/Department";
import { ISODate } from "../../../shared/types/ISODateStrings";
import DateSelector from "../../../shared/ui/DateSelector";
import DepartmentSelector from "../../../shared/ui/DepartmentSelector";
import MainContentLayout from "../../../shared/ui/layouts/MainContentLayout";
import { setDepartmentMonitor, setDiaryDateMonitor } from "../model/monitorSlice";

import MonitorTable from "./MonitorTable";

function Monitor() {
  const department = useAppSelector((state) => state.monitor.department);
  const diaryDate = useAppSelector((state) => state.monitor.diaryDate);

  const dispatch = useAppDispatch();
  const setDepartment = (department: Department) => dispatch(setDepartmentMonitor(department));
  const setDiaryDate = (diaryDate: ISODate) => dispatch(setDiaryDateMonitor(diaryDate));

  return (
    <MainContentLayout>
      <>
        <DateSelector diaryDate={diaryDate} setDiaryDate={setDiaryDate} />
        <DepartmentSelector selectedDepartment={department} setSelectedDepartment={setDepartment} />
      </>
      <MonitorTable department={department} diaryDate={diaryDate} />
    </MainContentLayout>
  );
}

export default Monitor;
