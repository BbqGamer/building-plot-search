import io
import sys
import logging
from zipfile import ZipFile

import geopandas as gpd
import requests
from owslib.wfs import WebFeatureService

from app.data import Preprocessed


def get_gdf_from_geopoz(id: int) -> gpd.GeoDataFrame:
    """Fetches a ZIP file from GeoPoz by an ID. Finds a GML file in it.
       Reads and returns a GeoDataFrame from it."""

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


GEOPOZ_GEOSERVER_URL = 'https://wms2.geopoz.poznan.pl/geoserver'

def fetch_gdf_from_geoserver(layer_name: str, service_url) -> gpd.GeoDataFrame:
    """Fetches a GML files from OGC service by layer name.
       Reads and returns a GeoDataFrame from it 
       link to some services: https://sipgeoportal.geopoz.poznan.pl/uslugi-ogc/
    """

    wfs11 = WebFeatureService(service_url, version='1.1.0')
    if wfs11 is None:
        logging.error("Error connecting to WFS service.")
        sys.exit(1)
        
    OUTPUT_FORMAT = 'GML2'
    response = wfs11.getfeature(typename=layer_name, outputFormat=OUTPUT_FORMAT)
    logging.info(f"Converting {layer_name} to a GeoDataFrame...")
    try:
        gdf = gpd.read_file(response.read())
        logging.info(f"Conversion of {layer_name} to a GeoDataFrame successful.")
        return gdf
    except Exception as e:
        logging.error(f"Error parsing GML file: {e}")
        sys.exit(1)

    

def get_preprocessed() -> Preprocessed:
    logging.info("Getting and preprocessing remote data...")
    
    data = [
        get_gdf_from_geopoz(8781),
        get_gdf_from_geopoz(8782),
    ]

    topo_layers = [
        'tereny_komunikacyjne_e_sql',
        'tereny_wodne_e_sql',
        'tereny_wodne_sql',
        'kon_line_sql',
        'zwj_poly_sql',
        'zwr_poly_sql',
        'kot_line_sql',
        'kok_line_sql',
        'kow_line_sql',
    ]
    
    TOPO_SERVICE = GEOPOZ_GEOSERVER_URL + '/topografia/wfs'
    for layer in topo_layers:
        data.append(fetch_gdf_from_geoserver(layer, TOPO_SERVICE))
    
    preprocessed = Preprocessed(*data)
    return preprocessed
