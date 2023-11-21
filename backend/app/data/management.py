import logging
from datetime import datetime

from app.data import Processed
from app.data.acquisition import get_preprocessed
from app.data.availability import (
    get_latest_path_and_freshness,
    get_local_processed,
    save_processed,
)
from app.data.processing import get_processed


def get_remote_processed(start: datetime = None):
    try:
        if start is None:
            start = datetime.today()

        preprocessed = get_preprocessed()
        processed = get_processed(preprocessed)

        save_processed(processed, start)

        logging.info("Processed remote data has been retrieved successfully")

        return processed
    except Exception as e:
        logging.exception("Failed to get processed remote data")
        raise e


is_updating = False


def get_initial_data():
    global is_updating

    try:
        is_updating = True

        start = datetime.today()

        [path, is_fresh] = get_latest_path_and_freshness()

        if is_fresh:
            return get_local_processed(path)

        try:
            return get_remote_processed(start)
        except Exception:
            if path:
                return get_local_processed(path)

            logging.critical("No processed data is available")
            exit(1)
    finally:
        is_updating = False


def get_message_and_updated_data_singletone() -> [str, Processed | None]:
    global is_updating

    if is_updating:
        return ["Another update is already in progress", None]

    try:
        is_updating = True
        processed = get_remote_processed()
        return ["The data has been updated successfully", processed]
    except Exception:
        return ["Failed to update the data", None]
    finally:
        is_updating = False
