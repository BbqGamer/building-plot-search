import logging
from app.plots import (
    import_plot_data,
    process_plot_id_column,
    plots_for_district,
    prepare_plot_dataframe
)

from app.buildings import import_building_data
from app.districts import District, all_districts
from app.plots import (
    import_plot_data,
    plots_for_district,
    prepare_plot_dataframe,
    process_plot_id_column,
)
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.background import BackgroundScheduler
from app.update import (
    is_data_up_to_date, 
    download_and_unzip_archive, 
    delete_all_data
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

scheduler = BackgroundScheduler()
scheduler.start()

plots = import_plot_data()
prepare_plot_dataframe(plots)
process_plot_id_column(plots)

buildings = import_building_data()

def update_data_task():
    logging.info("Autoupdating the data...")
    if not is_data_up_to_date():
        logging.info("Data is not up to date.")
        delete_all_data()
        download_and_unzip_archive("https://bip.geopoz.poznan.pl/download/119/8781/data.zip", "data")
        download_and_unzip_archive("https://bip.geopoz.poznan.pl/download/119/8782/data.zip", "data")

scheduler.add_job(update_data_task, 'cron', month='*', hour=0, minute=0)


@app.get("/")
def read_root():
    return {"Building": "Plot Search"}


@app.get("/districts/")
def get_all_districts() -> list[District]:
    return all_districts()


MAX_AREA = 1000000


@app.get("/plots/")
def get_plots_for_district(district_id: int = 0, min_area: float = 0.0, max_area: float = MAX_AREA):
    return plots_for_district(plots, district_id, min_area, max_area)


@app.get("/update_data/")
def manual_data_update():
    delete_all_data()
    download_and_unzip_archive("https://bip.geopoz.poznan.pl/download/119/8781/data.zip", "data")
    download_and_unzip_archive("https://bip.geopoz.poznan.pl/download/119/8782/data.zip", "data")