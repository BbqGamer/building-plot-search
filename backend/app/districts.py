from pydantic import BaseModel


class District(BaseModel):
    id: int
    name: str


def get_all_districts() -> list[District]:
    return [
        District(id=id, name=name)
        for id, name in sorted(district_map.items(), key=lambda x: x[1])
    ]


district_map = {
    1: "Główna",
    2: "Głowieniec",
    3: "Komandoria",
    4: "Śródka",
    5: "Rataje",
    6: "Żegrze",
    7: "Chartowo",
    8: "Kobylepole",
    9: "Spławie",
    10: "Krzesiny",
    11: "Starołęka",
    12: "Głuszyna",
    13: "Głuszyna II",
    14: "Piotrowo",
    15: "Karolin",
    16: "Daszewice",
    20: "Golęcin",
    21: "Jeżyce",
    22: "Krzyżowniki",
    23: "Ławica II",
    24: "Psarskie",
    25: "Strzeszyn",
    26: "Wielkie",
    27: "Kiekrz",
    28: "Podolany",
    35: "Górczyn",
    36: "Junikowo",
    37: "Kotowo",
    38: "Ławica",
    39: "Łazarz",
    41: "Plewiska",
    50: "Naramowice",
    51: "Centrum",
    52: "Winiary",
    53: "Piątkowo",
    54: "Morasko",
    55: "Radojewo",
    56: "Umultowo",
    60: "Dębiec",
    61: "Wilda",
}
