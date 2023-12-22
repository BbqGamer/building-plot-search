import logging
from os import getenv
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import RedirectResponse

from app.data.availability import get_latest_path_and_freshness
from app.data.management import (
    get_initial_data,
    get_message_and_updated_data_singletone,
)
from app.districts import get_all_districts
from app.plots import get_filtered_plots
from app.data.acquisition import get_purposes
from app.purposes import get_all_purposes

app = FastAPI()

VERSION = "1.1.3"


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Building plot search API",
        version=VERSION,
        description=(
            "The pp is available at "
            "[https://plots.vrepetskyi.codes](https://plots.vrepetskyi.codes)"
        ),
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        ["https://plots.vrepetskyi.codes"]
        if getenv("ENV") == "production"
        else ["http://localhost:3000", "http://127.0.0.1:3000"]
    ),
    allow_methods=["GET"],
)


@app.get("/")
def redirect_to_docs():
    return RedirectResponse("/docs")


@app.get("/version")
def get_version():
    return VERSION


logging.basicConfig(level=logging.INFO)


data = get_initial_data()
mpzp = get_purposes()

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
def get_plots(district_id: Optional[int] = None,
                 min_area: Optional[int] = None,
                 max_area: Optional[int] = None): 
    return get_filtered_plots(data.plots, district_id, min_area, max_area)

@app.get("/purposes/")
def get_purposes():
    return get_all_purposes(mpzp)

