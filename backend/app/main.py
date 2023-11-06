import logging
from typing import Union

from app.buildings import import_building_data
from app.districts import District, all_districts
from app.plots import (
    import_plot_data,
    plots_for_district,
    prepare_plot_dataframe,
    process_plot_id_column,
)
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

plots = import_plot_data()
prepare_plot_dataframe(plots)
process_plot_id_column(plots)

buildings = import_building_data()


@app.get("/")
def read_root():
    return {"Building": "Plot Search"}


@app.get("/districts/")
def get_all_districts() -> list[District]:
    return all_districts()


@app.get("/plots/")
def get_plots_for_district(district_id: int, min_area: int, max_area: int):
    return plots_for_district(plots, district_id, min_area, max_area)
