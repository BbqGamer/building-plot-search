import io
import logging
import os
import pathlib
import zipfile
from datetime import datetime

import requests
from bs4 import BeautifulSoup

DATA_DIR = pathlib.Path("data")
last_update = None


def download_and_unzip_archive(zip_url: str, extract_to: str) -> None:
    """Download .zip archive from provided URL and unpack it to the target diractory."""
    logging.info("Downloading the .zip...")
    response = requests.get(zip_url)
    logging.info(f"Downloading completed with code: {response.status_code}")

    logging.info("Starting .zip extraction...")
    if response.status_code == 200:
        with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
            zip_ref.extractall(extract_to)
        logging.info("Extraction completed.")
    else:
        logging.info(
            f"Failed to download the file. Status code: {response.status_code}."
        )


updates_url = "https://bip.geopoz.poznan.pl/gpb/rejestr/1675,dok.html"
update_field_selector = "#table-listing table tr:nth-child(2) td:first-child"
last_download = None


def is_data_up_to_date() -> bool:
    global last_download

    """Returns True if there are no updates or False if data not up to date."""
    logging.info(f"Request to {updates_url} ...")
    response = requests.get(updates_url)
    logging.info(f"Request completed with code: {response.status_code}")

    if response.status_code == 200:
        logging.info("Generating BeautifulSoup structure and querring for the field...")
        soup = BeautifulSoup(response.text, "html.parser")
        specific_field = soup.select_one(update_field_selector)
        logging.info("Querring completed.")

        if specific_field:
            logging.info(f"Last data version update: {specific_field.text.strip()}")
            last_data_version = specific_field.text
            date_format = "%d.%m.%Y %H:%M"
            if last_download == None:
                logging.info("FIRST update, anyway will be executed.")
                return False
            logging.info(
                f"Last downloaded version is ({last_download}), last available data from ({last_data_version})."
            )
            if datetime.strftime(last_download, date_format) >= datetime.strftime(
                last_data_version, date_format
            ):
                last_download = last_data_version
                return True
        else:
            logging.info(f"Field not found using selector: {update_field_selector}")
    else:
        logging.info(
            f"Failed to download the file. Status code: {response.status_code}."
        )

    return False


def delete_all_data(directory_path="data") -> None:
    """Made just for deleting old data from 'data' directory"""
    logging.info("Deleting of old data is started.")
    try:
        files = os.listdir(directory_path)

        for file_name in files:
            file_path = os.path.join(directory_path, file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)
                logging.info(f"Deleted: {file_path}")

        logging.info("All files deleted successfully.")
    except Exception as e:
        logging.info(f"An error occurred: {e}")
