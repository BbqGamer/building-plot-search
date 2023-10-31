import { Map as LeafletMap } from "leaflet";
import { PropsWithChildren, memo, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { ZoomControl } from "react-leaflet/ZoomControl";
import { INITIAL_X, INITIAL_Y, MAX_X, MAX_Y, MIN_X, MIN_Y } from "../utils";

type MapHandlerProps = {
  setMap: (x: LeafletMap) => void;
};

type MapProps = PropsWithChildren<MapHandlerProps>;

const MapHandler = memo(({ setMap }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
});

export const Map = memo(({ setMap, children }: MapProps) => (
  <MapContainer
    center={[INITIAL_Y, INITIAL_X]}
    zoom={12}
    minZoom={7}
    zoomControl={false}
    maxBounds={[
      [MAX_Y, MIN_X],
      [MIN_Y, MAX_X],
    ]}
    maxBoundsViscosity={1}
    className="h-full max-w-full rounded-md focus:border-blue-400 border-neutral-100 border-4 border-solid outline-none"
  >
    <MapHandler setMap={setMap} />
    {children}
    <TileLayer
      attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <ZoomControl position="topright" />
  </MapContainer>
));
