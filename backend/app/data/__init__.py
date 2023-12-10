from pathlib import Path
from typing import NamedTuple

import geopandas as gpd

gpd.options.io_engine = "pyogrio"

DATA_DIR = Path("processed")
ENTRY_DATE_FORMAT = "%y%m%d-%H%M"


class Preprocessed(NamedTuple):
    plots: gpd.GeoDataFrame
    buildings: gpd.GeoDataFrame
    streets: gpd.GeoDataFrame
    water_areas1: gpd.GeoDataFrame
    water_areas2: gpd.GeoDataFrame
    line_streets: gpd.GeoDataFrame
    staying_water: gpd.GeoDataFrame
    running_water: gpd.GeoDataFrame
    tram_lines: gpd.GeoDataFrame
    rail_lines1: gpd.GeoDataFrame
    rail_lines2: gpd.GeoDataFrame


class Processed(NamedTuple):
    plots: gpd.GeoDataFrame
