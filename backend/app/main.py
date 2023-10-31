from typing import Union
from app.plots import (
    import_plot_data,
    process_plot_id_column,
    plots_for_district,
    prepare_plot_dataframe
)
from app.districts import all_districts, District
import logging

from fastapi import FastAPI

app = FastAPI()

logging.basicConfig(level=logging.INFO)

plots = import_plot_data()
prepare_plot_dataframe(plots)
process_plot_id_column(plots)

@app.get("/")
def read_root():
    return {"Building": "Plot Search"}

@app.get("/districts/")
def get_all_districts() -> list[District]:
    return all_districts()

@app.get("/plots/")
def get_plots_for_district(district_id: int, min_area: int, max_area: int):
    return plots_for_district(plots, district_id, min_area, max_area)
