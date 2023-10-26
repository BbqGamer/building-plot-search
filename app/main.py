from typing import Union
from app.plots import import_plot_data, process_plot_id_column
from app.districts import all_districts, District
import logging

from fastapi import FastAPI

app = FastAPI()

logging.basicConfig(level=logging.INFO)

plots = import_plot_data()
process_plot_id_column(plots)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/districts/")
def get_all_districts() -> list[District]:
    return all_districts()

