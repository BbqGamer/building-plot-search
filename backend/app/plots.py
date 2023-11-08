import pathlib
import logging
from pydantic import BaseModel
import geopandas as gpd
from typing import Optional

gpd.options.io_engine = "pyogrio"


DATA_DIR = pathlib.Path('data')
PLOTS_GML = DATA_DIR / 'plots.gml'
PLOTS_FEATHER = DATA_DIR / 'plots.feather'


def import_plot_data() -> gpd.GeoDataFrame:
    """Import plot data from GML file, or feather file if it exists
    If feather doesn't exist but GML does, create feather file"""

    if PLOTS_FEATHER.exists():
        logging.info("Importing plots data from feather file...")
        return gpd.read_feather(PLOTS_FEATHER)
    elif PLOTS_GML.exists():
        logging.info("Importing plots data from GML file...")
        plots = gpd.read_file(PLOTS_GML)
        logging.info("Converting to feather file...")
        plots.to_feather(PLOTS_FEATHER)
        return plots
    else:
        raise FileNotFoundError('No plot data found.')


def prepare_plot_dataframe(plots: gpd.GeoDataFrame) -> None:
    """Prepare plot data for use in API"""
    logging.info("Preparing plot data...")
    TO_DROP = [
        "waznoscOd",
        "waznoscDo",
        "wartoscGruntu",
        "dataWyceny",
        "informacjaODokladnReprezentacjiPola",
        "nrRejestruZabytkow",
        "idRejonuStatystycznego",
        "dzialkaObjetaFormaOchronyPrzyrody",
    ]  # These columns were empty

    logging.info(plots.columns)
    plots.drop(columns=TO_DROP, inplace=True)

    RENAME_MAPPING = {
        'idDzialki': 'id',
    }

    plots.rename(columns=RENAME_MAPPING, inplace=True)


def process_plot_id_column(plots: gpd.GeoDataFrame) -> None:
    """Split plot_id column into district, sheet, and plot_number columns"""
    logging.info("Processing plot_id column...")

    def split_plot_id(plot_id):
        _, district, sheet, plot_number = plot_id.split('.')
        return int(district), int(sheet[3:]), plot_number

    plots[['district', 'sheet', 'plot_number']
          ] = plots.id.apply(split_plot_id).tolist()


class Plot(BaseModel):
    id: str
    district: int
    sheet: int
    plot_number: str
    geometry: list[tuple[float, float]]
    area: float
    centroid: tuple[float, float] = None


WEB_MERCATOR_CRS = 'EPSG:3857'
HEAD = 20  # For now show only 20 plots change to pagination later


def plots_for_district(plots: gpd.GeoDataFrame, district_id: int, min_area: float, max_area: float) -> list[Plot]:
    """Return plots for a given district"""
    logging.info(f"Getting plots for district {district_id}...")
    results = []
    plots_d = plots[(plots.district == district_id)
                    ] if district_id != 0 else plots
    filtered = plots_d[(plots_d.geometry.area > min_area) &
                       (plots_d.geometry.area < max_area)].head(HEAD)

    # Project from EPSG:2177 (Poland) to EPSG:3857 (Web Mercator)
    converted = filtered.to_crs(WEB_MERCATOR_CRS)  # type: ignore
    for _, row in converted.iterrows():
        p = Plot(
            id=row.id,
            district=row.district,
            sheet=row.sheet,
            plot_number=row.plot_number,
            geometry=row.geometry.exterior.coords,
            area=row.geometry.area,
            centroid=row.geometry.centroid.coords[0],
        )
        results.append(p)
    return results
