from pydantic import BaseModel


class District(BaseModel):
    id: int
    name: str


def get_all_districts() -> list[District]:
    return [District(id=id, name=name) for id, name in district_map.items()]


district_map = {
    1: "GŁÓWNA",
    2: "GŁOWIENIEC",
    3: "KOMANDORIA",
    4: "ŚRÓDKA",
    5: "RATAJE",
    6: "ŻEGRZE",
    7: "CHARTOWO",
    8: "KOBYLEPOLE",
    9: "SPŁAWIE",
    10: "KRZESINY",
    11: "STAROŁĘKA",
    12: "GŁUSZYNA",
    13: "GŁUSZYNA II",
    14: "PIOTROWO",
    15: "KAROLIN",
    16: "DASZEWICE",
    20: "GOLĘCIN",
    21: "JEŻYCE",
    22: "KRZYŻOWNIKI",
    23: "ŁAWICA II",
    24: "PSARSKIE",
    25: "STRZESZYN",
    26: "WIELKIE",
    27: "KIEKRZ",
    28: "PODOLANY",
    35: "GÓRCZYN",
    36: "JUNIKOWO",
    37: "KOTOWO",
    38: "ŁAWICA",
    39: "ŁAZARZ",
    41: "PLEWISKA",
    50: "NARAMOWICE",
    51: "POZNAŃ",
    52: "WINIARY",
    53: "PIĄTKOWO",
    54: "MORASKO",
    55: "RADOJEWO",
    56: "UMULTOWO",
    60: "DĘBIEC",
    61: "WILDA",
}
