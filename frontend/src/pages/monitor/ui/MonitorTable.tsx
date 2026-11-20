import { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router";

import {
  CaseDiseaseResponse,
  ExtraInfoInpatient,
  ExtraInfoOutpatient,
  ExtraInfoPatient,
  patientApi,
  PatientInfoResponse,
  SummaryResponse,
} from "../../../entities/patient";
import { DATE_INPUT_DELAY, SUMMARY_UPDATE_INTERVAL } from "../../../shared/config/config";
import Department from "../../../shared/types/Department";
import { ISODate } from "../../../shared/types/ISODateStrings";
import { ContentOfTableContent, TableContent } from "../../../shared/types/TableContent";
import Table from "../../../shared/ui/Table";
import styles from "../../../shared/ui/Table.module.css";

type MonitorTableProps = {
  department: Department;
  diaryDate: ISODate;
};

function MonitorTable({ department, diaryDate }: MonitorTableProps) {
  const [summary, setSummary] = useState<SummaryResponse[]>([]);
  const [tableContent, setTableContent] = useState<TableContent<PatientInfoResponse & CaseDiseaseResponse>>({
    head: {},
    content: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getSummary = useCallback(() => {
    patientApi
      .getSummary(department, diaryDate)
      .then(setSummary)
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, [department, diaryDate]);

  useEffect(() => {
    const intervalId = setInterval(getSummary, SUMMARY_UPDATE_INTERVAL);
    setIsLoading(true);
    return () => clearInterval(intervalId);
  }, [diaryDate, department, getSummary]);

  useEffect(() => {
    const timeoutId = setTimeout(getSummary, DATE_INPUT_DELAY);
    return () => clearTimeout(timeoutId);
  }, [diaryDate, getSummary]);

  useEffect(() => {
    setTableContent({
      head: {
        АСУ: "card_id",
        "Ф. И. О.": "full_name",
        Возраст: "age_at_date",
        Отделение: "department",
        Диагноз: "diagnosis",
        "Время поступления": "admission_date",
        "Время обследования / исход": "result",
      },
      content: summary.reduce<ContentOfTableContent<PatientInfoResponse & CaseDiseaseResponse>[]>(
        (content, { patient, case_disease }) => {
          const classList: string[] = [];
          if (case_disease.is_reanimation) {
            classList.push(styles.reanimation);
          } else if (case_disease.is_inpatient) {
            classList.push(styles.inpatient);
          }
          if (!case_disease.is_outcome) {
            classList.push(styles.processing);
          }
          if (!["РЕАН ЗАЛ", "ВСЕ ОТДЕЛЕНИЯ"].includes(department)) {
            if (case_disease.is_inpatient && case_disease.inpatient_department !== department) {
              classList.push(styles.toOtherDepartment);
            }
            if (case_disease.is_inpatient && case_disease.department !== department) {
              classList.push(styles.fromOtherDepartment);
            }
          }
          content.push({
            data: { ...patient, ...case_disease },
            classList: classList,
            action: () => navigate(`/patients/${patient.patient_id}`, { relative: "path" }),
            actionTitle: "Все обращения",
            extraInfoCol1: <ExtraInfoPatient patient={patient} />,
            extraInfoCol2: <ExtraInfoOutpatient case_disease={case_disease} />,
            extraInfoCol3: <ExtraInfoInpatient case_disease={case_disease} />,
          });
          return content;
        },
        []
      ),
    });
  }, [department, navigate, summary]);

  return (
    <Table
      title="МОНИТОР"
      helpMessage="Выбор пациента"
      noDataMessage="НЕТ ОБРАЩЕНИЙ"
      tableContent={tableContent}
      isLoading={isLoading}
    />
  );
}

export default MonitorTable;
