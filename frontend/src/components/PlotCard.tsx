import { Map } from "leaflet";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import { Plot, fetchToponyms, flyTo } from "../helpers";

export const PlotCard = memo(
  ({ id, plot, map }: { id: string; plot: Plot; map: Map | undefined }) => {
    const { data: toponyms } = useQuery(["toponyms"], fetchToponyms);

    const [copyText, setCopyText] = useState("Copy");

    return (
      <div
        id={id}
        className="p-2 rounded-md bg-neutral-600 flex flex-col gap-1"
        tabIndex={0}
      >
        <label
          className="text-neutral-300 text-xs font-thin [&:hover>button:last-child]:bg-neutral-400 relative flex cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          <span className="flex-1">{plot.id}</span>
          <button
            className="px-1 bg-neutral-500 rounded-md !outline-offset-0"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              navigator.clipboard.writeText(plot.id);
              setCopyText("Copied");
              setTimeout(() => {
                setCopyText("Copy");
              }, 1000);
              (e.target as HTMLButtonElement).blur();
            }}
          >
            {copyText}
          </button>
        </label>
        <div className="flex flex-col [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div>span:first-child]:text-neutral-300 [&>div>span:first-child]:text-sm [&>div>span:first-child]:flex-1 items-baseline">
          <div>
            <span>District:</span>
            <span>
              {toponyms?.find((y) => y.id === plot.topographyId)?.name ||
                "Unknown"}
            </span>
          </div>
          <div>
            <span>Sheet:</span>
            <span>{plot.sheet}</span>
          </div>
          <div>
            <span>Number:</span>
            <span>{plot.number}</span>
          </div>
          <div>
            <span>Area:</span>
            <span>
              {plot.area.toFixed(2)} m<sup>2</sup>
            </span>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className="flex-1 button"
            onClick={() => {
              flyTo(map, plot.centroid);
            }}
          >
            Map
          </button>
          <a
            target="_blank"
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${plot.centroid.join(
              ",",
            )}`}
            className="flex-1 block text-center button"
          >
            Street View
          </a>
        </div>
      </div>
    );
  },
);
