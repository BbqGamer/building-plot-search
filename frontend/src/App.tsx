import { memo } from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { ZoomControl } from "react-leaflet/ZoomControl";

export const App = memo(() => {
  return (
    <div className="flex text-neutral-100 flex-col h-screen bg-neutral-800 p-4 gap-4">
      <div className="flex items-center">
        <h1 className="text-2xl">Building plot search</h1>
        <span className="h-6 mx-4 w-[1px] bg-neutral-100 rounded-full" />
        <div className="font-normal flex gap-4">
          <button>Guide</button>
          <button>Settings</button>
          <button>Contacts</button>
        </div>
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-col w-[500px] max-w-[50%] gap-4">
          <div className="flex-1 bg-neutral-700 rounded-md p-4">
            <h2>Filters</h2>
          </div>
          <div className="flex-1 bg-neutral-700 rounded-md p-4">
            <h2>Results</h2>
          </div>
        </div>
        <div className="flex-1 bg-neutral-700 rounded-md overflow-hidden">
          <MapContainer
            className="h-full"
            center={[48.15, 37.74]}
            zoom={12}
            zoomControl={false}
          >
            <TileLayer
              attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
});
