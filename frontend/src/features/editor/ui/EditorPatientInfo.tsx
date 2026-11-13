import { useAppSelector } from "../../../app/store/hooks";
import { PatientInfo } from "../../../entities/patient";

type EditorPatientInfoProps = {
  id: string;
};

function EditorPatientInfo({ id }: EditorPatientInfoProps) {
  console.log("RENDER PATIENT INFO");

  const patientInfo = useAppSelector((state) => state.editor.editorTabs[id]?.patientInfo);

  if (!patientInfo) {
    throw "Tab with id=" + id + " not found!";
  }

  return <PatientInfo patientInfo={patientInfo} />;
}

export default EditorPatientInfo;
