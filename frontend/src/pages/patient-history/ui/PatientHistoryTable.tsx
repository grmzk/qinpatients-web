import { useNavigate } from "react-router";

import { useAppDispatch } from "../../../app/store/hooks";
import { CaseDiseaseResponse, PatientInfoResponse } from "../../../entities/patient";
import { addEditorTab } from "../../../features/editor";
import { ContentOfTableContent, TableContent } from "../../../shared/types/TableContent";
import Table from "../../../shared/ui/Table";
import styles from "../../../shared/ui/Table.module.css";

type PatientHistoryTableProps = {
  patientInfo: PatientInfoResponse | undefined;
  history: CaseDiseaseResponse[] | undefined;
  isLoading: boolean;
};

function PatientHistoryTable({ patientInfo, history, isLoading }: PatientHistoryTableProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tableContent = {
    head: {
      АСУ: "card_id",
      "Стац. номер": "inpatient_id",
      "Время поступления": "admission_date",
      Отделение: "department",
      Диагноз: "diagnosis",
      Врач: "doctor",
      Исход: "result",
    },
    content:
      patientInfo && history
        ? history.reduce<ContentOfTableContent<CaseDiseaseResponse>[]>((content, case_disease) => {
            const classList: string[] = [];
            if (case_disease.is_reanimation) {
              classList.push(styles.reanimation);
            } else if (case_disease.is_inpatient) {
              classList.push(styles.inpatient);
            }
            if (!case_disease.is_outcome) {
              classList.push(styles.processing);
            }
            content.push({
              data: case_disease,
              classList: classList,
              onClick: () => {
                dispatch(addEditorTab({ patientInfo, caseDisease: case_disease, editorType: "FIRST_EXAMINATION" }));
                navigate("/editor");
              },
            });
            return content;
          }, [])
        : [],
  } satisfies TableContent<CaseDiseaseResponse>;

  return (
    <Table
      title="СПИСОК ОБРАЩЕНИЙ ПАЦИЕНТА [БД БСМП №1]"
      helpMessage=""
      noDataMessage="НЕТ ОБРАЩЕНИЙ"
      tableContent={tableContent}
      isLoading={isLoading}
    />
  );
}

export default PatientHistoryTable;
