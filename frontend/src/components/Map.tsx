import { Map as LeafletMap } from "leaflet";
import { PropsWithChildren, memo, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { ZoomControl } from "react-leaflet/ZoomControl";

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
    center={[52.41, 16.93]}
    zoom={12}
    zoomControl={false}
    className="h-full max-w-full rounded-md focus:border-blue-400 border-neutral-700 border-4 border-solid outline-none"
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
