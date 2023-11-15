import logging
import requests
import zipfile
import pathlib
import io
import os

DATA_DIR = pathlib.Path('data')

def download_and_unzip_archive(zip_url:str, extract_to:str):
    raise NotImplementedError

def is_data_up_to_date() -> bool:
    raise NotImplementedError
