from dataclasses import dataclass
from datetime import datetime


@dataclass
class Notice:
    date: datetime
    where: str
    transmitted: str
    received: str

    def get_date(self) -> str | None:
        if not self.date or (self.date.year == 1):
            return None
        return self.date.strftime('%d.%m.%Y %H:%M')
