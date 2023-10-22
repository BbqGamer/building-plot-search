import { Map as LeafletMap } from "leaflet";
import { memo, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { ZoomControl } from "react-leaflet/ZoomControl";

type MapProps = {
  setMap: (x: LeafletMap) => void;
};

const MapHandler = memo(({ setMap }: MapProps) => {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
});

export const Map = memo((props: MapProps) => (
  <MapContainer
    center={[52.41, 16.93]}
    zoom={12}
    zoomControl={false}
    className="h-full max-w-full"
  >
    <MapHandler {...props} />
    <TileLayer
      attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <ZoomControl position="topright" />
  </MapContainer>
));
