import pathlib
import logging
import geopandas as gpd

gpd.options.io_engine = "pyogrio"


DATA_DIR = pathlib.Path('data')
BUILDINGS_GML = DATA_DIR / 'buildings.gml'
BUILDINGS_FEATHER = DATA_DIR / 'buildings.feather'

def import_building_data() -> gpd.GeoDataFrame:
    """Import buildings data from GML file, or feather file if it exists
    If feather doesn't exist but GML does, create feather file"""

    if BUILDINGS_FEATHER.exists():
        logging.info("Importing building data from feather file...")
        return gpd.read_feather(BUILDINGS_FEATHER)
    elif BUILDINGS_GML.exists():
        logging.info("Importing building data from GML file...")
        plots = gpd.read_file(BUILDINGS_GML)
        logging.info("Converting to feather file...")
        plots.to_feather(BUILDINGS_FEATHER)
        return plots
    else:
        raise FileNotFoundError('No building data found.')

