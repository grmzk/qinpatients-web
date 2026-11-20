from dataclasses import dataclass


@dataclass
class DiagnosisMkb:
    order: int
    mkb: str
    text: str

    def as_dict(self):
        return {
            "icd": self.mkb,
            "text": self.text,
        }
