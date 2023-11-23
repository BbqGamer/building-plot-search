import logging
from datetime import datetime
from os import path, scandir
from pathlib import Path

import geopandas as gpd
import requests
from bs4 import BeautifulSoup

from app.data import DATA_DIR, ENTRY_DATE_FORMAT, Processed

CHANGELOG_URL = "https://bip.geopoz.poznan.pl/gpb/rejestr/1675,dok.html"
LATEST_TIME_SELECTOR = "#table-listing table tr:nth-child(2) td:first-child"


def get_latest_path_and_freshness() -> [str | None, bool]:
    "Returns the path to the latest processed data and a boolean representing its freshness"

    latest = None
    local_time = None

    if path.isdir(DATA_DIR):
        entries = [entry.name for entry in scandir(DATA_DIR) if entry.is_dir()]
        if len(entries):
            latest = max(entries)
            local_time = datetime.strptime(latest, ENTRY_DATE_FORMAT)

    if not latest:
        logging.info("No local data is available")
        return [None, False]

    try:
        response = requests.get(CHANGELOG_URL)
        parsed = BeautifulSoup(response.text, "html.parser")
        remote_time_tag = parsed.select_one(LATEST_TIME_SELECTOR)
        remote_time = datetime.strptime(remote_time_tag.text, "%d.%m.%Y %H:%M")

        is_fresh = remote_time < local_time

        if is_fresh:
            logging.info("The local data is up-to-date")
        else:
            logging.info(f"Fresh data is available for {remote_time}")

        return [latest, is_fresh]
    except Exception:
        logging.exception("Failed to check the data freshness")
        return [latest, False]


def get_local_processed(dir_name: str) -> Processed:
    logging.info(
        f"Retrieving local data for {datetime.strptime(dir_name, ENTRY_DATE_FORMAT)}..."
    )

    return Processed(
        *[
            gpd.read_feather(Path(DATA_DIR, dir_name, f"{field}.feather"))
            for field in Processed._fields
        ]
    )


def save_processed(processed: Processed, start: datetime):
    dir_name = start.strftime(ENTRY_DATE_FORMAT)

    dir = Path(DATA_DIR, dir_name)
    dir.mkdir(parents=True, exist_ok=True)

    for key, value in zip(Processed._fields, processed):
        path = dir / f"{key}.feather"
        value.to_feather(path)
        logging.info(f"Saved processed {key} to {path}")
