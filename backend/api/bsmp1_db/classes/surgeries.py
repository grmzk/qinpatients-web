from dataclasses import dataclass
from datetime import datetime
from typing import Union


@dataclass
class Surgery:
    title: str | None
    date: datetime
    department: Union[str, None] = None
    doctor: Union[str, None] = None

    def get_date(self) -> str | None:
        if not self.date or (self.date.year == 1):
            return None
        return self.date.strftime("%d.%m.%Y")
