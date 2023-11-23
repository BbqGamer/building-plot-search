import logging

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.data.availability import get_latest_path_and_freshness
from app.data.management import (
    get_initial_data,
    get_message_and_updated_data_singletone,
)
from app.districts import get_all_districts
from app.plots import get_filtered_plots

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "https://plots.vrepetskyi.codes"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


@app.get("/")
def redirect_to_docs():
    return RedirectResponse("/docs")


data = get_initial_data()


@app.get("/update-data/")
def update_data():
    global data

    [message, updated] = get_message_and_updated_data_singletone()

    if updated:
        data = updated

    return message


def update_data_if_outdated():
    [_, is_fresh] = get_latest_path_and_freshness()

    if not is_fresh:
        update_data()


scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(update_data_if_outdated, "cron", day="*")


@app.get("/districts/")
def get_districts():
    return get_all_districts()


@app.get("/plots/")
def get_plots(district_id: int = None, min_area: int = None, max_area: int = None):
    return get_filtered_plots(data.plots, district_id, min_area, max_area)
