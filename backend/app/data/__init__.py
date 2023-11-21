from pathlib import Path
from typing import NamedTuple

import geopandas as gpd

gpd.options.io_engine = "pyogrio"

DATA_DIR = Path("data")
ENTRY_DATE_FORMAT = "%y%m%d-%H%M"


class Preprocessed(NamedTuple):
    plots: gpd.GeoDataFrame
    buildings: gpd.GeoDataFrame


class Processed(NamedTuple):
    plots: gpd.GeoDataFrame
