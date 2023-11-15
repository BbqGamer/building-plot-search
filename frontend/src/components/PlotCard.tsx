import { Map } from "leaflet";
import { memo } from "react";
import { useQuery } from "react-query";
import { Plot, fetchToponyms } from "../helpers";

export const PlotCard = memo(
  ({ plot, map }: { plot: Plot; map: Map | undefined }) => {
    const { data: toponyms } = useQuery(["toponyms"], fetchToponyms);

    const flyTo = () => {
      map?.flyTo([plot.centroid[1], plot.centroid[0]], 17, {
        duration: 0.3,
      });
    };

    return (
      <div className="p-4 rounded-md bg-neutral-600">
        <div className="grid grid-cols-[100px_250px]">
          <span>ID:</span>
          <span>{plot.id}</span>
          <span>Sheet:</span>
          <span>{plot.sheet}</span>
          <span>Number:</span>
          <span>{plot.number}</span>
          <span>District:</span>
          <span>
            {toponyms?.find((y) => y.id === plot.topographyId)?.name ||
              "Unknown"}
          </span>
          <span>Area:</span>
          <span>
            {plot.area.toFixed(2)} m<sup>2</sup>
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 p-1 bg-neutral-500 text-neutral-100 rounded-md"
            onClick={flyTo}
          >
            Map
          </button>
          <a
            target="_blank"
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${plot.centroid[1]},${plot.centroid[0]}`}
            className="flex-1 block p-1 text-center bg-neutral-500 text-neutral-100 rounded-md"
          >
            Street View
          </a>
        </div>
      </div>
    );
  },
);
