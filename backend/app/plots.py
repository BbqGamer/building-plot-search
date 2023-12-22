import geopandas as gpd
import numpy as np
from pydantic import BaseModel
from typing import Optional
from app.purposes import get_purpose_region


class Plot(BaseModel):
    id: str
    district: int
    sheet: int
    plot_number: str
    geometry: list[tuple[float, float]]
    area: float
    centroid: tuple[float, float]
    is_probably_free: bool


def get_filtered_plots(
    plots: gpd.GeoDataFrame, mpzp: gpd.GeoDataFrame, district_id: Optional[int],
    min_area: Optional[float], max_area: Optional[float], pgroup: Optional[str], 
psubgroup: Optional[str])-> list[Plot]:
    filtered = plots[plots.is_probably_free]

    if district_id:
        filtered = filtered[filtered.district == district_id]

    if min_area:
        filtered = filtered[filtered.area >= min_area]

    if max_area:
        filtered = filtered[filtered.area <= max_area]
    
    if pgroup or psubgroup:
        THRESHOLD = 0.8
        reg = get_purpose_region(mpzp, pgroup, psubgroup)
        filtered = filtered[filtered.geometry.apply(
            lambda x: percentage_contained(x, reg) > THRESHOLD)]

    filtered = filtered.head(1000)
    converted = filtered.to_crs("WGS84")
    converted["area"] = filtered.geometry.area

    results = []

    for _, row in converted.iloc[np.argsort(converted.area)].iterrows():
        results.append(
            Plot(
                id=row.id,
                district=row.district,
                sheet=row.sheet,
                plot_number=row.plot_number,
                geometry=[
                    coordinate_pair[::-1]
                    for coordinate_pair in row.geometry.exterior.coords
                ],
                area=row.area,
                centroid=row.geometry.centroid.coords[0][::-1],
                is_probably_free=row.is_probably_free,
            )
        )

    return results

def percentage_contained(p1, p2):
    return p1.intersection(p2).area
