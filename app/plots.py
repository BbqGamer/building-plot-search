import pathlib
import geopandas as gpd
import logging


DATA_DIR = pathlib.Path('data')
PLOTS_GML = DATA_DIR / 'plots.gml'
PLOTS_FEATHER = DATA_DIR / 'plots.feather'

def import_plot_data():
    """Import plot data from GML file, or feather file if it exists
    If feather doesn't exist but GML does, create feather file"""

    if PLOTS_FEATHER.exists():
        logging.info("Importing data from feather file...")
        return gpd.read_feather(PLOTS_FEATHER)
    elif PLOTS_GML.exists():
        logging.info("Importing data from GML file...")
        plots = gpd.read_file(PLOTS_GML)
        logging.info("Converting to feather file...")
        plots.to_feather(PLOTS_FEATHER)
        return plots
    else:
        raise FileNotFoundError('No plot data found.')


def process_plot_id_column(plots: gpd.GeoDataFrame) -> None:
    """Split plot_id column into district, sheet, and plot_number columns"""
    logging.info("Processing plot_id column...")

    def split_plot_id(plot_id):
        _, district, sheet, plot_number = plot_id.split('.')
        return int(district), int(sheet[3:]), plot_number

    plots[['district', 'sheet', 'plot_number']] = plots.idDzialki.apply(split_plot_id).tolist()
        
