import { Fragment } from "react";

import styles from "../../../shared/ui/Table.module.css";
import CaseDiseaseResponse from "../model/CaseDiseaseResponse";

type ExtraInfoInpatientProps = {
  case_disease: CaseDiseaseResponse;
};

function ExtraInfoInpatient({ case_disease }: ExtraInfoInpatientProps) {
  return (
    <>
      <div className={styles.extraInfoContentTitle}>
        <u>Госпитализация</u>
      </div>
      <div>
        {case_disease.is_inpatient && (
          <>
            <u>Стационарный номер:</u> {case_disease.inpatient_id}
          </>
        )}
        {!!case_disease.movements?.length && (
          <>
            <br />
            <u>Движение по отделениям:</u>
            {case_disease.movements.map((movement, index) => (
              <Fragment key={index}>
                <br />
                {index + 1 + ") " + movement.department?.toUpperCase() + " [" + movement.bed_type?.toUpperCase() + "]:"}
                <br />
                {movement.income_date + " - "}
                {!!movement.outcome_date && movement.outcome_date}
              </Fragment>
            ))}
          </>
        )}
        {!!case_disease.surgeries?.length && (
          <>
            <br />
            <u>Операции и прочие вмешательства:</u>
            {case_disease.surgeries.map((surgery, index) => (
              <Fragment key={index}>
                <br />
                {index + 1 + ") " + surgery.date?.toUpperCase() + " [" + surgery.department?.toUpperCase() + "]:"}
                <br />
                {'"' + surgery.title?.toUpperCase() + '"'}
                {!!surgery.doctor && (
                  <>
                    <br />
                    {"Оператор: " + surgery.doctor?.toUpperCase()}
                  </>
                )}
              </Fragment>
            ))}
          </>
        )}
        {!!case_disease.inpatient_diagnosis?.length && (
          <>
            <br />
            <u>Диагноз:</u>
            {case_disease.inpatient_diagnosis.map((diagnosis_icd, index) => (
              <Fragment key={index}>
                <br />
                {diagnosis_icd.icd + ' - "' + diagnosis_icd.text?.toUpperCase() + '"'}
              </Fragment>
            ))}
          </>
        )}
        {case_disease.is_inpatient && (
          <>
            <br />
            <u>Исход госпитализации:</u>
            <br />
            {case_disease.inpatient_result}
          </>
        )}
      </div>
    </>
  );
}

export default ExtraInfoInpatient;
