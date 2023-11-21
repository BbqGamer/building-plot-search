import logging

from app.buildings import import_building_data
from app.districts import District, all_districts
from app.plots import (
    import_plot_data,
    plots_for_district,
    prepare_plot_dataframe,
    process_plot_id_column,
)
from app.update import delete_all_data, download_and_unzip_archive, is_data_up_to_date
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

@app.get("/update-data/")
def update_data():
    logging.info("Autoupdating the data...")
    if not is_data_up_to_date():
        logging.info("Data is not up to date.")
        delete_all_data()
        download_and_unzip_archive(
            "https://bip.geopoz.poznan.pl/download/119/8781/data.zip", "data"
        )
        download_and_unzip_archive(
            "https://bip.geopoz.poznan.pl/download/119/8782/data.zip", "data"
        )

update_data()

scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(update_data, "cron", day="*")

plots = import_plot_data()
prepare_plot_dataframe(plots)
process_plot_id_column(plots)

buildings = import_building_data()
prepare_building_dataframe(buildings)
process_building_id_column(buildings)

check_if_plot_is_free(plots, buildings)

@app.get("/")
def read_root():
    return {"Building": "Plot Search"}


@app.get("/districts/")
def get_all_districts() -> list[District]:
    return all_districts()

MAX_AREA = 1000000

@app.get("/plots/")
def get_plots_for_district(
    district_id: int = 0, min_area: float = 0.0, max_area: float = MAX_AREA
):
    return plots_for_district(plots, district_id, min_area, max_area)
