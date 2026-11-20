import { ISODate } from "../../../shared/types/ISODateStrings";

type PatientInfoResponse = {
  patient_id: number;
  full_name: string;
  birthday: ISODate;
  age: string;
  age_at_date: string;
  workplace: string;
  address: string;
  extra_info: string;
};

export default PatientInfoResponse;
