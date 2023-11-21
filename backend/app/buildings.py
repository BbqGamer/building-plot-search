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
        buildings = gpd.read_file(BUILDINGS_GML)
        logging.info("Converting to feather file...")
        buildings.to_feather(BUILDINGS_FEATHER)
        return buildings
    else:
        raise FileNotFoundError('No building data found.')
    
def prepare_building_dataframe(buildings: gpd.GeoDataFrame) -> None:
    """Prepare building data for use in API"""
    logging.info("Preparing plot data...")
    TO_DROP = [
        'boundedBy', 
        'klasaWgPKOB', 
        'glownaFunkcjaBudynku',
        'dataWyceny',
        'liczbaKondygnacjiNadziemnych',
        'liczbaKondygnacjiPodziemnych',
        'liczbaUjawnionychSamodzielnychLokali',
        'materialScianZewn',
        'numerRejestruZabytkow',
        'powZabudowy',
        'rokZakonczeniaBudowy',
        'wartoscBudynku',
        'stopienPewnosciUstaleniaDatyBudowy',
        'stanUzytkowaniaBudynku',
        'dataOddaniaDoUzytkowaniaBudynku',
        'dataRozbiorkiBudynku',
        'przyczynaRozbiorkiBudynku',
        'liczbaLokaliOOkreslonejLiczbieIzb',
        'lacznaLiczbaIzbWBudynku',
        'czyWiata',
    ]  # These columns were empty

    logging.info(buildings.columns)
    buildings.drop(columns=TO_DROP, inplace=True)

    RENAME_MAPPING = {
        'idDzialki': 'id',
    }

    buildings.rename(columns=RENAME_MAPPING, inplace=True)

def process_building_id_column(buildings: gpd.GeoDataFrame) -> None:
    """Split building column into district, sheet, and plot_number columns"""
    logging.info("Processing plot_id column...")

    def split_plot_id(building_id):
        _, district, sheet, building_number = building_id.split('.')
        return int(district), int(sheet[3:]), building_number

    buildings[['district', 'sheet', 'building_number']
          ] = buildings.id.apply(split_plot_id).tolist()

import_building_data()