from dataclasses import dataclass
from datetime import datetime


@dataclass
class Doctor:
    family: str
    name: str
    surname: str
    department: str
    work_start_date: datetime
    work_end_date: datetime

    def get_work_start_date(self) -> str | None:
        if not self.work_start_date or (self.work_start_date.year == 1):
            return None
        return self.work_start_date.strftime('%d.%m.%Y')

    def get_work_end_date(self) -> str | None:
        if not self.work_end_date or (self.work_end_date.year == 1):
            return None
        return self.work_end_date.strftime('%d.%m.%Y')

    def get_full_name(self) -> str:
        return f'{self.family} {self.name} {self.surname}'
