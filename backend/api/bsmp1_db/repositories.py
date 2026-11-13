import re
from datetime import date, datetime, timedelta
from typing import Union

from .adapters import (
    get_last_case_disease_data,
    get_patient_data,
    get_patient_history_data,
    get_search_data,
    get_summary_data,
)
from .classes.patients import Patient
from .utils import get_diary_today


def get_summary(
    start_date: date,
    department: Union[str, None] = None,
    surgery_all: bool = True,
) -> list[dict]:
    start_datetime = datetime(
        year=start_date.year,
        month=start_date.month,
        day=start_date.day,
        hour=8,
        minute=0,
    )
    end_datetime = start_datetime + timedelta(days=1)
    pattern_surgery = re.compile(r"^.* ХИРУРГИЯ$")
    summary_data = get_summary_data(start_datetime, end_datetime)
    summary = []
    for item in summary_data:
        case_disease = item["case_disease"]
        if not department:
            pass
        elif (
            surgery_all
            and pattern_surgery.match(department)
            and pattern_surgery.match(case_disease.admission_department)
        ):
            pass
        elif (
            department == "РЕАН ЗАЛ"
        ) and not case_disease.is_reanimation_hole():  # noqa: R507
            continue
        elif (department not in ["ВСЕ ОТДЕЛЕНИЯ", "РЕАН ЗАЛ", None]) and (
            department
            not in [
                case_disease.admission_department,
                case_disease.inpatient_department,
            ]
        ):
            continue
        if case_disease.is_processing() and start_date == get_diary_today():
            summary.append(item)
        elif case_disease.admission_income_date >= start_datetime and (
            case_disease.is_outcome()
            and (case_disease.admission_outcome_date < end_datetime)
        ):
            summary.append(item)
        elif case_disease.admission_income_date < start_datetime and (
            (not case_disease.is_outcome())
            or (case_disease.admission_outcome_date >= start_datetime)
        ):
            summary.append(item)
    return summary


def get_patient(patient_id: int) -> Patient | None:
    patient_data = get_patient_data(patient_id)
    return patient_data[0]["patient"] if patient_data else None


def get_patient_history(patient_id: int) -> dict | None:
    patient_history_data = get_patient_history_data(patient_id)
    history = []
    for item in patient_history_data:
        history.append(item["case_disease"])
    return (
        {"patient": patient_history_data[0]["patient"], "history": history}
        if history
        else None
    )


def search(
    fullname: str,
    start_date: datetime,
    end_date: datetime,
    department: str | None = None,
) -> list[dict]:
    return get_search_data(
        fullname,
        start_date,
        end_date,
        department,
    )


def get_last_case_disease_list(main_card_last_id: int) -> list[dict]:
    return get_last_case_disease_data(main_card_last_id)
