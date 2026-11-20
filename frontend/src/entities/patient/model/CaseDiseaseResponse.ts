import { ISODateTime, ISODate } from "../../../shared/types/ISODateStrings";

type Notice = {
  date: ISODateTime;
  where: string;
  transmitted: string;
  received: string;
};

type Movement = {
  department: string;
  bed_type: string;
  income_date: ISODateTime;
  outcome_date: ISODateTime;
};

type Surgery = {
  title: string;
  date: ISODate;
  department: string;
  doctor: string;
};

type DiagnosisIcd = {
  icd: string;
  text: string;
};

type CaseDiseaseResponse = {
  card_id: number;
  admission_date: ISODateTime;
  admission_outcome_date: ISODateTime;
  department: string;
  incoming_diagnosis: string;
  admission_diagnosis: string;
  diagnosis: string;
  outpatient_id: number;
  inpatient_id: number | "";
  inpatient_department: string;
  doctor: string;
  result: string;
  is_reanimation: boolean;
  is_outcome: boolean;
  is_inpatient: boolean;
  trauma_type: string | null;
  directed: string;
  notices: Notice[];
  movements: Movement[];
  surgeries: Surgery[];
  inpatient_diagnosis: DiagnosisIcd[];
  inpatient_result: string;
};

export default CaseDiseaseResponse;
