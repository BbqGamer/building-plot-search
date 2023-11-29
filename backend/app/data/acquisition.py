import io
import logging
from zipfile import ZipFile

import geopandas as gpd
import requests
from owslib.wfs import WebFeatureService

from app.data import Preprocessed


def get_gdf_from_geopoz(id: int) -> gpd.GeoDataFrame:
    """Fetches a ZIP file from GeoPoz by an ID. Finds a GML file in it. Reads and returns a GeoDataFrame from it."""

    url = f"https://bip.geopoz.poznan.pl/download/119/{id}/data.zip"

    logging.info(f"Getting {url}...")
    response = requests.get(url)
    response.raise_for_status()

    logging.info(f"Looking for a GML file in {url}...")
    with ZipFile(io.BytesIO(response.content)) as zip:
        for file in zip.filelist:
            if file.filename.endswith(".gml"):
                logging.info(f"Converting {url}/{file.filename} to a GeoDataFrame...")
                return gpd.read_file(zip.open(file))

    raise Exception(f"There is no GML file in {url}")

def get_gdf_wfs_from_geopoz(name: str) -> gpd.GeoDataFrame:
    """Fetches a GML files from GeoPoz by layer name. Reads and returns a GeoDataFrame from it."""

    url = 'https://wms2.geopoz.poznan.pl/geoserver/topografia//wfs'

    wfs11 = WebFeatureService(url, version='1.1.0')
    output_format = 'GML2'
    response = wfs11.getfeature(typename='topografia:'+str(name), outputFormat=output_format)
    logging.info(f"Converting {name} to a GeoDataFrame...")
    return gpd.read_file(io.BytesIO(response.read()))

def get_preprocessed() -> Preprocessed:
    logging.info("Getting and preprocessing remote data...")
    preprocessed = Preprocessed(get_gdf_from_geopoz(8781), get_gdf_from_geopoz(8782), get_gdf_wfs_from_geopoz("tereny_komunikacyjne_e_sql"), get_gdf_wfs_from_geopoz("tereny_wodne_e_sql"), get_gdf_wfs_from_geopoz("tereny_wodne_sql"), get_gdf_wfs_from_geopoz("zwj_poly_sql"), get_gdf_wfs_from_geopoz("zwr_poly_sql"))
    return preprocessed
