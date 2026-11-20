import { Fragment } from "react";

import styles from "../../../shared/ui/Table.module.css";
import CaseDiseaseResponse from "../model/CaseDiseaseResponse";

type ExtraInfoOutpatientProps = {
  case_disease: CaseDiseaseResponse;
};

function ExtraInfoOutpatient({ case_disease }: ExtraInfoOutpatientProps) {
  return (
    <>
      <div className={styles.extraInfoContentTitle}>
        <u>Приёмное отделение</u>
        {case_disease.is_reanimation && (
          <>
            <br />
            [РЕАНИМАЦИОННЫЙ ЗАЛ]
          </>
        )}
      </div>
      <div>
        {!!case_disease.outpatient_id && (
          <>
            <u>Амбулаторный номер:</u> {case_disease.outpatient_id}
            <br />
          </>
        )}
        <u>Направлен:</u> {case_disease.directed?.toUpperCase()}
        {case_disease.trauma_type && (
          <>
            <br />
            <u>Тип травмы:</u> {case_disease.trauma_type?.toUpperCase()}
          </>
        )}
        {!!case_disease.notices?.length && (
          <>
            <br />
            <u>Извещение:</u>
            {case_disease.notices.map((notice, index) => (
              <Fragment key={index}>
                <br />
                {index + 1 + ") " + notice.date + " ПЕРЕДАНО:"}
                <br />
                {'"' + notice.where + '"'}
                <br />
                {notice.transmitted + " => " + notice.received}
              </Fragment>
            ))}
          </>
        )}
        <br />
        <u>Диагноз при поступлении:</u>
        <br />
        {case_disease.incoming_diagnosis?.toUpperCase()}
        <br />
        <u>Диагноз приёмного отделения:</u>
        <br />
        {case_disease.admission_diagnosis?.toUpperCase()}
        {case_disease.doctor && (
          <>
            <br />
            <u>Врач приёмного отделения:</u>
            <br />
            {case_disease.doctor?.toUpperCase()}
          </>
        )}
        <br />
        <u>Исход приёмного отделения:</u>
        <br />
        {case_disease.result}
      </div>
    </>
  );
}

export default ExtraInfoOutpatient;
