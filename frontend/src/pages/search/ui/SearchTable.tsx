import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import {
  CaseDiseaseResponse,
  ExtraInfoInpatient,
  ExtraInfoOutpatient,
  ExtraInfoPatient,
  PatientInfoResponse,
  SummaryResponse,
} from "../../../entities/patient";
import { ContentOfTableContent, TableContent } from "../../../shared/types/TableContent";
import Table from "../../../shared/ui/Table";
import styles from "../../../shared/ui/Table.module.css";

type SearchTableProps = {
  searchResponse: SummaryResponse[];
  isLoading: boolean;
};

function SearchTable({ searchResponse, isLoading }: SearchTableProps) {
  const [tableContent, setTableContent] = useState<TableContent<PatientInfoResponse & CaseDiseaseResponse>>({
    head: {},
    content: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTableContent({
      head: {
        АСУ: "card_id",
        "Ф. И. О.": "full_name",
        Возраст: "age",
        Отделение: "department",
        Диагноз: "diagnosis",
        "Время поступления": "admission_date",
        Врач: "doctor",
        Исход: "result",
      },
      content: searchResponse.reduce<ContentOfTableContent<PatientInfoResponse & CaseDiseaseResponse>[]>(
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
  }, [searchResponse, navigate]);

  return (
    <Table
      title="ПОИСК [БД БСМП №1]"
      helpMessage="Выбор пациента"
      noDataMessage="ОБРАЩЕНИЯ НЕ НАЙДЕНЫ"
      tableContent={tableContent}
      isLoading={isLoading}
    />
  );
}

export default SearchTable;
