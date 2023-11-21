import geopandas as gpd
from pydantic import BaseModel


class Plot(BaseModel):
    id: str
    district: int
    sheet: int
    plot_number: str
    geometry: list[tuple[float, float]]
    area: float
    centroid: tuple[float, float] = None
    probably_free: bool


WEB_MERCATOR_CRS = "WGS84"
HEAD = 20  # For now show only 20 plots change to pagination later


def get_filtered_plots(
    plots: gpd.GeoDataFrame, district_id: int, min_area: float, max_area: float
) -> list[Plot]:
    results = []
    plots_d = plots[(plots.district == district_id)] if district_id != 0 else plots
    filtered = plots_d[
        (plots_d.geometry.area > min_area)
        & (plots_d.geometry.area < max_area)
        & (plots_d.probably_free)
    ].head(HEAD)

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
            probably_free=row.probably_free,
        )
        results.append(p)
    return results
