import re
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Union

from ..constants import (
    REJECTIONS,
    STATUS_INPATIENT,
    STATUS_OTHER_HOSPITAL,
    STATUS_OUTPATIENT,
    STATUS_OUTPATIENT_MAIN,
    STATUS_PROCESSING,
)
from .diagnosis_mkb import DiagnosisMkb
from .movements import Movement
from .notices import Notice
from .surgeries import Surgery


@dataclass
class CaseDisease:
    card_id: int
    admission_income_date: datetime
    admission_outcome_date: datetime
    admission_department: str
    reanimation_hole: str
    incoming_diagnosis: str
    admission_diagnosis: str
    status: int
    reject: int
    inpatient_department: str
    outpatient_id: int
    inpatient_id: int
    admission_doctor: str
    movements: list[Movement]
    surgeries: list[Surgery]
    inpatient_diagnosis: list[DiagnosisMkb]
    notices: list[Notice]
    inpatient_outcome_date: datetime
    inpatient_result: str
    inpatient_doctor: str
    trauma_type: str
    directed: str
    directed_from: str

    def get_admission_income_date(self) -> str:
        return self.admission_income_date.strftime("%d.%m.%Y %H:%M")

    def get_admission_outcome_date(self) -> str | None:
        if not self.admission_outcome_date:
            return None
        return self.admission_outcome_date.strftime("%d.%m.%Y %H:%M")

    def get_inpatient_outcome_date(self) -> str | None:
        if not self.inpatient_outcome_date or (
            self.inpatient_outcome_date.year == 1
        ):
            return None
        return self.inpatient_outcome_date.strftime("%d.%m.%Y %H:%M")

    def is_reanimation_hole(self) -> bool:
        if not self.reanimation_hole or self.reanimation_hole == "F":
            return False
        return True

    def get_admission_diagnosis(self):
        return self.admission_diagnosis or self.incoming_diagnosis

    def is_inpatient(self) -> bool:
        return self.status == STATUS_INPATIENT

    def is_outpatient(self) -> bool:
        return self.status == STATUS_OUTPATIENT_MAIN

    def is_other_hospital(self) -> bool:
        return self.status == STATUS_OTHER_HOSPITAL

    def is_processing(self) -> bool:
        if (
            self.is_reanimation_hole()
            and self.admission_diagnosis
            and self.is_inpatient()
        ):
            return False
        if self.is_reanimation_hole() and (
            (self.admission_income_date + timedelta(hours=2)) > datetime.now()
        ):
            return True
        return self.status == STATUS_PROCESSING

    def is_outcome(self) -> bool:
        return not self.is_processing()

    def is_vascular_center(self) -> bool:
        return self.admission_department in ["КАРДИОЛОГИЯ", "НЕВРОЛОГИЯ"]

    def is_therapy_or_cardiology2(self) -> bool:
        pattern_therapy = re.compile(r"^.* ТЕРАПИЯ$")
        return bool(
            self.admission_department == "2 КАРДИОЛОГИЯ"
            or pattern_therapy.match(self.admission_department)
        )

    def is_reanimation_hole_reg_bug(self) -> bool:
        return bool(
            self.is_reanimation_hole()
            and self.admission_diagnosis
            and self.is_inpatient()
            and (len(self.movements) == 1)
            and (self.movements[0].get_bed_type() == "РЕАН ЗАЛ")
            and not self.movements[0].get_outcome_date()
        )

    def is_reanimation_hole_death(self) -> bool:
        return bool(
            self.is_reanimation_hole()
            and self.admission_diagnosis
            and self.is_inpatient()
            and (len(self.movements) == 1)
            and (self.movements[0].get_bed_type() == "РЕАН ЗАЛ")
            and self.movements[0].get_outcome_date()
        )

    def is_inpatient_death(self) -> bool:
        return not self.is_reanimation_hole_death() and (
            self.inpatient_result == "УМЕР"
        )

    def is_death(self) -> bool:
        return self.is_reanimation_hole_death() or self.is_inpatient_death()

    def is_reanimation_hole_no_data_transmitted(self) -> bool:
        return (
            self.is_reanimation_hole()
            and not self.is_processing()
            and not self.admission_diagnosis
        )

    def get_admission_result(self) -> str:
        if self.is_processing():
            exam_duration = datetime.now() - self.admission_income_date
            hours = int(exam_duration.total_seconds() // 3600)
            minutes = int(exam_duration.total_seconds() % 3600 // 60)
            if hours < 0:
                return "0 ч. 0 мин."
            return f"{hours} ч. {minutes} мин."
        if self.is_reanimation_hole_reg_bug():
            return "РЕГИСТРАТУРОЙ НЕ ЗАПОЛНЕНО ДВИЖЕНИЕ"
        if self.is_reanimation_hole_death():
            return "УМЕР В РЕАН ЗАЛЕ"
        if self.is_reanimation_hole_no_data_transmitted():
            return "ДАННЫЕ ОБ ИСХОДЕ НЕ ПЕРЕДАНЫ В РЕГИСТРАТУРУ"
        if self.is_inpatient():
            return f"ГОСПИТАЛИЗАЦИЯ [{self.inpatient_department}]"
        if self.is_outpatient():
            if self.reject != STATUS_OUTPATIENT:
                return f"АМБУЛАТОРНОЕ ЛЕЧЕНИЕ [{REJECTIONS[self.reject]}]"
            return "АМБУЛАТОРНОЕ ЛЕЧЕНИЕ"
        if self.is_other_hospital():
            return "ДРУГОЙ СТАЦИОНАР"
        return "НЕИЗВЕСТНО"

    def get_inpatient_result(self) -> Union[str, None]:
        if self.is_reanimation_hole_death():
            return "УМЕР В РЕАН ЗАЛЕ"
        if (
            self.is_reanimation_hole_no_data_transmitted()
            and not self.inpatient_result
        ):
            return None
        return self.inpatient_result or "НАХОДИТСЯ В СТАЦИОНАРЕ"

    def get_inpatient_id(self) -> int | str:
        return (
            self.inpatient_id
            if self.inpatient_id and self.inpatient_id > 0
            else 0
        )

    def get_outpatient_id(self) -> int | str:
        return (
            self.outpatient_id
            if self.outpatient_id and self.outpatient_id > 0
            else 0
        )

    def as_dict(self):
        return {
            "card_id": self.card_id,
            "admission_date": self.get_admission_income_date(),
            "admission_outcome_date": self.get_admission_outcome_date(),
            "department": self.admission_department,
            "incoming_diagnosis": (
                self.incoming_diagnosis.upper()
                if self.incoming_diagnosis
                else ""
            ),
            "admission_diagnosis": (
                self.admission_diagnosis.upper()
                if self.admission_diagnosis
                else ""
            ),
            "diagnosis": (
                self.get_admission_diagnosis().upper()
                if self.get_admission_diagnosis()
                else ""
            ),
            "outpatient_id": self.get_outpatient_id(),
            "inpatient_id": self.get_inpatient_id(),
            "inpatient_department": self.inpatient_department or "",
            "doctor": self.admission_doctor or "",
            "result": self.get_admission_result(),
            "is_reanimation": self.is_reanimation_hole(),
            "is_outcome": self.is_outcome(),
            "is_inpatient": self.is_inpatient(),
            "trauma_type": self.trauma_type,
            "directed": self.directed_from or self.directed,
            "notices": [notice.as_dict() for notice in self.notices],
            "movements": [movement.as_dict() for movement in self.movements],
            "surgeries": [surgery.as_dict() for surgery in self.surgeries],
            "inpatient_diagnosis": [
                diagnosis_icd.as_dict()
                for diagnosis_icd in self.inpatient_diagnosis
            ],
            "inpatient_result": self.get_inpatient_result() or "",
        }
