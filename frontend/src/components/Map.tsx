import { Map as LeafletMap, WMSParams } from "leaflet";
import { PropsWithChildren, memo, useEffect } from "react";
import { LayersControl, WMSTileLayer, useMap } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { INITIAL_X, INITIAL_Y, MAX_X, MAX_Y, MIN_X, MIN_Y } from "../helpers";

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
    maxBounds={[
      [MAX_Y, MIN_X],
      [MIN_Y, MAX_X],
    ]}
    maxBoundsViscosity={1}
    className="h-full max-w-full rounded-md focus:border-blue-400 border-neutral-100 border-4 border-solid focus:outline-none"
  >
    <LayersControl>
      <LayersControl.BaseLayer name="OpenStreetMap" checked>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Google satelite">
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution="Google Maps Satelite"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Sentinel color">
        <WMSTileLayer
          url="https://services.sentinel-hub.com/ogc/wms/7492af93-ee0f-416b-bcea-fa0ae3eaaf1a"
          params={
            {
              urlProcessingApi:
                "https://services.sentinel-hub.com/ogc/wms/1d4de4a3-2f50-493c-abd8-861dec3ae6b2",
              layers: "COLOR",
              maxcc: 0,
            } as WMSParams
          }
          attribution='&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>'
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="Sentinel radar">
        <WMSTileLayer
          url="https://services.sentinel-hub.com/ogc/wms/7492af93-ee0f-416b-bcea-fa0ae3eaaf1a"
          params={
            {
              urlProcessingApi:
                "https://services.sentinel-hub.com/ogc/wms/1d4de4a3-2f50-493c-abd8-861dec3ae6b2",
              layers: "RADAR",
            } as WMSParams
          }
          attribution='&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>'
        />
      </LayersControl.BaseLayer>
      {children}
      <LayersControl.Overlay name="Purpose" checked>
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/urbanistyka/ows"
          params={
            {
              layers: "mpzp_funkcje_pow_g_sql",
              version: "1.3.0",
              format: "image/png",
              transparent: true,
              CRS: "CRS:84",
            } as WMSParams
          }
          opacity={0.75}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Landscape">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/urbanistyka/ows"
          params={
            {
              layers: "krajobraz",
              version: "1.3.0",
              format: "image/png",
              transparent: true,
              CRS: "CRS:84",
            } as WMSParams
          }
          opacity={0.5}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Building height">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/ows"
          params={
            {
              layers: "mw_bloki",
              version: "1.3.0",
              format: "image/png",
              CRS: "CRS:84",
            } as WMSParams
          }
          opacity={0.75}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Revitalization">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/urbanistyka/ows"
          params={
            {
              layers: "rewitalizacja_aft_sql",
              version: "1.3.0",
              format: "image/png",
              transparent: true,
              CRS: "CRS:84",
            } as WMSParams
          }
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Investments">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/ows"
          params={
            {
              layers: "inwestycje_group",
              version: "1.3.0",
              format: "image/png",
              transparent: true,
              CRS: "CRS:84",
            } as WMSParams
          }
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Roads">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/topografia/ows"
          params={
            {
              layers: "tereny_komunikacyjne_e_sql",
              version: "1.3.0",
              format: "image/png",
              transparent: true,
              CRS: "CRS:84",
            } as WMSParams
          }
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Greenery">
        <WMSTileLayer
          url="https://wms2.geopoz.poznan.pl/geoserver/ows"
          params={
            {
              layers: "podklad_uzbrojenie",
              version: "1.3.0",
              format: "image/png",
              CRS: "CRS:84",
            } as WMSParams
          }
          opacity={0.5}
        />
      </LayersControl.Overlay>
    </LayersControl>
    <MapHandler setMap={setMap} />
  </MapContainer>
));
