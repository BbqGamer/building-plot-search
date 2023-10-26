from typing import Union
from app.plots import import_plot_data
import logging

from fastapi import FastAPI

app = FastAPI()

logging.basicConfig(level=logging.INFO)
plots = import_plot_data()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

