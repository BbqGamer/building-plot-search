import logging
import requests
import zipfile
import pathlib
import io
import os

DATA_DIR = pathlib.Path('data')
last_update = None

def download_and_unzip_archive(zip_url:str, extract_to:str):
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
        logging.info(f"Failed to download the file. Status code: {response.status_code}")

def is_data_up_to_date() -> bool:
    """Returns True if there are no updates or False if data not up to date."""
    raise NotImplementedError
