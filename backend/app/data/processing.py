import logging

import geopandas as gpd
from shapely.ops import transform

from app.data import Preprocessed, Processed


def prepare_plot_dataframe(plots: gpd.GeoDataFrame):
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
        "idDzialki": "id",
    }

    plots.rename(columns=RENAME_MAPPING, inplace=True)

def swap_coordinates(coord1, coord2):
    if coord1 is not None and coord2 is not None:
        return coord2, coord1
    else:
        return None

def prepare_clearing_plots_dataframe(df: gpd.GeoDataFrame):
    df = df[df.geometry.notnull()]
    df["geometry"] = df["geometry"].apply(lambda x: transform(swap_coordinates, x))


def process_plot_id_column(plots: gpd.GeoDataFrame):
    """Split plot_id column into district, sheet, and plot_number columns"""
    logging.info("Processing plot_id column...")

    def split_plot_id(plot_id):
        _, district, sheet, plot_number = plot_id.split(".")
        return int(district), int(sheet[3:]), plot_number

    plots[["district", "sheet", "plot_number"]] = plots.id.apply(split_plot_id).tolist()


def check_if_plot_is_free(plots: gpd.GeoDataFrame, buildings: gpd.GeoDataFrame):
    """Check if plot is free"""
    logging.info("Looking for plots without buildings...")

    overlay = gpd.overlay(
        plots[["id", "geometry"]],
        buildings[["idBudynku", "geometry"]],
        how="intersection",
    )

    overlay = plots[["id", "geometry"]].merge(overlay, on="id", suffixes=("", "_p"))
    overlay = gpd.GeoDataFrame(overlay, geometry="geometry")

    threshold = 0.02
    overlay["area"] = overlay.geometry.area
    overlay["area_p"] = overlay.geometry_p.area

    overlay["area_p>2%"] = overlay["area_p"] > threshold * overlay["area"]
    overlay = overlay[overlay["area_p>2%"]]

    plots["is_probably_free"] = ~plots["id"].isin(overlay["id"])

def multi_pol_unfree_plot(plots: gpd.GeoDataFrame, to_remove: gpd.GeoDataFrame, threshold: float = 0.02):
    to_remove = to_remove.reset_index().drop(columns='index')
    to_remove = to_remove.explode(index_parts=True)
    to_remove.crs = plots.crs
    to_remove = to_remove.reset_index()

    new_plots = plots[plots["is_probably_free"]==True].copy()

    crossed_streets = gpd.overlay(new_plots[["id", "geometry"]], to_remove[["gml_id", "geometry"]], how="intersection", keep_geom_type=True)

    new_plots = plots[['id', 'geometry']].merge(crossed_streets, on="id", suffixes=("", "_p"))
    new_plots = gpd.GeoDataFrame(new_plots, geometry="geometry")
    
    new_plots["area"] = new_plots.geometry.area
    new_plots["area_p"] = new_plots.geometry_p.area
    new_plots["area_p>2%"] = new_plots["area"] > threshold * new_plots["area_p"]
    new_plots = new_plots[new_plots["area_p>2%"]]

    to_update = plots["is_probably_free"]==True
    plots.loc[to_update, "is_probably_free"] = ~plots.loc[to_update, "id"].isin(new_plots["id"])

def unfree_plot(plots: gpd.GeoDataFrame, to_remove: gpd.GeoDataFrame, threshold: float = 0.02):
    to_remove.crs = plots.crs

    new_plots = plots[plots["is_probably_free"]==True].copy()

    overlay = gpd.overlay(new_plots[["id", "geometry"]], to_remove[["gml_id", "geometry"]], how="intersection")

    new_plots = plots[['id', 'geometry']].merge(overlay, on="id", suffixes=("", "_p"))
    new_plots = gpd.GeoDataFrame(new_plots, geometry="geometry")
    
    new_plots["area"] = new_plots.geometry.area     # area of plot
    new_plots["area_p"] = new_plots.geometry_p.area # area of intersection
    new_plots["area_p>2%"] = new_plots["area"] > threshold * new_plots["area_p"] 
    new_plots = new_plots[new_plots["area_p>2%"]] 

    to_update = plots["is_probably_free"]==True
    plots.loc[to_update, "is_probably_free"] = ~plots.loc[to_update, "id"].isin(new_plots["id"])


def get_processed(preprocessed: Preprocessed) -> Processed:
    logging.info("Processing the data...")

    prepare_plot_dataframe(preprocessed.plots)
    process_plot_id_column(preprocessed.plots)

    check_if_plot_is_free(preprocessed.plots, preprocessed.buildings)

    for df in [preprocessed.tereny_komunikacyjne, preprocessed.water_areas1, preprocessed.water_areas2, preprocessed.running_water, preprocessed.staying_water]:
        prepare_clearing_plots_dataframe(df)

    for df in [preprocessed.tereny_komunikacyjne, preprocessed.water_areas1, preprocessed.water_areas2]:
        multi_pol_unfree_plot(preprocessed.plots, df)

    for df in [preprocessed.running_water, preprocessed.staying_water]:
        unfree_plot(preprocessed.plots, df)

    return Processed(preprocessed.plots)
