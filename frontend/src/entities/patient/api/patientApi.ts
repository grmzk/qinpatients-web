import ApiAdapter from "../../../shared/api/ApiAdapter";
import { BASE_URL } from "../../../shared/config/config";
import Department from "../../../shared/types/Department";
import { ISODate } from "../../../shared/types/ISODateStrings";
import { SearchQuery } from "../../../shared/types/SearchQuery";
import PatientHistoryResponse from "../model/PatientHistoryResponse";
import PatientInfoResponse from "../model/PatientInfoResponse";
import SummaryResponse from "../model/SummaryResponse";

const adapter = new ApiAdapter(BASE_URL);

const patientApi = {
  async getSummary(department: Department, date: ISODate): Promise<SummaryResponse[]> {
    return await adapter.get(`/get_summary?department=${department}&date=${date}`);
  },

  async getPatientInfo(patientId: number): Promise<PatientInfoResponse> {
    return await adapter.get(`/get_patient?patient_id=${patientId}`);
  },

  async getPatientHistory(patientId: number): Promise<PatientHistoryResponse> {
    return await adapter.get(`/get_patient_history?patient_id=${patientId}`);
  },

  async search({ family, name, surname, startDate, endDate, department }: SearchQuery): Promise<SummaryResponse[]> {
    return await adapter.get(
      `/search?family=${family}&name=${name}&surname=${surname}&start_date=${startDate}&end_date=${endDate}&department=${department}`
    );
  },
};

export default patientApi;
