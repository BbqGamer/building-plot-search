import logging

import geopandas as gpd

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
    overlay["area_p"] = overlay.geometry_p.area  # plot area

    overlay["area_p>2%"] = overlay["area_p"] > threshold * overlay["area"]
    overlay = overlay[overlay["area_p>2%"]]

    plots["probably_free"] = plots["id"].isin(overlay["id"])


def get_processed(preprocessed: Preprocessed) -> Processed:
    logging.info("Processing the data...")

    prepare_plot_dataframe(preprocessed.plots)
    process_plot_id_column(preprocessed.plots)

    check_if_plot_is_free(preprocessed.plots, preprocessed.buildings)

    return Processed(preprocessed.plots)
