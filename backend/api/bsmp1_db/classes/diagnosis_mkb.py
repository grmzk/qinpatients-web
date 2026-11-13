from dataclasses import dataclass


@dataclass
class DiagnosisMkb:
    order: int
    mkb: str
    text: str
