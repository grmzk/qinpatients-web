from dataclasses import dataclass
from datetime import datetime

from ..constants import BED_TYPES


@dataclass
class Movement:
    order: int
    department: str
    bed_type: str
    income_date: datetime | None
    outcome_date: datetime | None

    def __post_init__(self):
        self.income_date = (
            self.income_date
            if self.income_date and self.income_date.year != 1
            else None
        )
        self.outcome_date = (
            self.outcome_date
            if self.outcome_date and self.outcome_date.year != 1
            else None
        )

    def get_bed_type(self) -> str:
        return BED_TYPES.get(self.bed_type) or self.bed_type

    def get_income_date(self) -> str | None:
        if not self.income_date:
            return None
        return self.income_date.strftime("%d.%m.%Y %H:%M")

    def get_outcome_date(self) -> str | None:
        if not self.outcome_date:
            return None
        return self.outcome_date.strftime("%d.%m.%Y %H:%M")
