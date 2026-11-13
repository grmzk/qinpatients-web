import { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";

import { patientApi, PatientHistoryResponse, PatientInfo } from "../../../entities/patient";
import { PATIENT_INFO_UPDATE_INTERVAL } from "../../../shared/config/config";
import MainContentLayout from "../../../shared/ui/layouts/MainContentLayout";

import PatientHistoryTable from "./PatientHistoryTable";

function PatientHistory() {
  const [response, setResponse] = useState<PatientHistoryResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const { patientId } = useParams();
  const navigate = useNavigate();

  if (!patientId || !isFinite(Number(patientId))) {
    navigate("/notfound", { replace: true });
  }

  const getPatientHistory = useCallback(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }
    patientApi
      .getPatientHistory(+patientId)
      .then(setResponse)
      .catch((error) => {
        if (error.status === 404) {
          navigate("/notfound", { replace: true });
        }
        console.warn(error);
      })
      .finally(() => setIsLoading(false));
  }, [patientId, navigate]);

  useEffect(() => {
    let intervalId = setTimeout(function call() {
      getPatientHistory();
      intervalId = setTimeout(call, PATIENT_INFO_UPDATE_INTERVAL);
    });
    setIsLoading(true);
    return () => clearInterval(intervalId);
  }, [patientId, getPatientHistory]);

  return (
    <MainContentLayout>
      <PatientInfo patientInfo={response?.patient} />
      <PatientHistoryTable patientInfo={response?.patient} history={response?.history} isLoading={isLoading} />
    </MainContentLayout>
  );
}

export default PatientHistory;
