import styles from "../../../shared/ui/Table.module.css";
import PatientInfoResponse from "../model/PatientInfoResponse";

type ExtraInfoPatientProps = {
  patient: PatientInfoResponse;
};

function ExtraInfoPatient({ patient }: ExtraInfoPatientProps) {
  return (
    <>
      <div className={styles.extraInfoContentTitle}>
        <u>Данные пациента</u>
      </div>
      <div>
        <u>Ф.И.О.:</u> {patient.full_name?.toUpperCase()}
        <br />
        <u>Дата рождения:</u> {patient.birthday} [{patient.age}]
        {patient.address && (
          <>
            <br />
            <u>Адрес:</u> {patient.address?.toUpperCase()}
          </>
        )}
        {patient.workplace && (
          <>
            <br />
            <u>Работа:</u> {patient.workplace?.toUpperCase()}
          </>
        )}
        {patient.extra_info && (
          <>
            <br />
            <u>Доп. информация:</u> {patient.extra_info?.toUpperCase()}
          </>
        )}
      </div>
    </>
  );
}

export default ExtraInfoPatient;
