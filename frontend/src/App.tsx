import { Map as LeafletMap } from "leaflet";
import { memo, useCallback, useRef } from "react";
import { Circle } from "react-leaflet";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Filters } from "./components/Filters";
import { Map } from "./components/Map";
import { DEFAULT_RADIUS } from "./utils";

export const App = memo(() => {
  const mapRef = useRef<LeafletMap>();

  const setMap = useCallback((x: LeafletMap) => {
    mapRef.current = x;
  }, []);

  const onLayout = useCallback(() => {
    mapRef.current?.invalidateSize();
  }, []);

  return (
    <div className="flex text-neutral-100 flex-col h-screen bg-neutral-800 py-4 gap-4">
      <div className="flex items-center px-4">
        <h1 className="text-2xl">Building plot search</h1>
        <span className="h-6 mx-4 w-[2px] bg-neutral-400" />
        <div className="-ml-1 font-normal flex gap-2 [&>button]:rounded-md [&>button]:p-1">
          <button>Guide</button>
          <button>Settings</button>
          <button>Contacts</button>
        </div>
      </div>
      <PanelGroup direction="horizontal" units="pixels" {...{ onLayout }}>
        <Panel defaultSize={500} minSize={300} maxSize={900} collapsible>
          <div className="h-full flex flex-col gap-4 pl-4">
            <div className="flex-1 bg-neutral-700 rounded-md p-4">
              <Filters />
            </div>
            <div className="flex-1 bg-neutral-700 rounded-md p-4">
              <h2>Results</h2>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="focus:outline-none [&>div>span]:focus:bg-blue-400">
          <div className="h-full w-4 flex items-center justify-center">
            <span className="h-8 w-1 rounded-full bg-neutral-100" />
          </div>
        </PanelResizeHandle>
        <Panel minSize={200} collapsible>
          <div className="h-full mr-4">
            <Map setMap={setMap}>
              <Circle
                center={[52.41, 16.93]}
                color="#404040"
                fill={false}
                radius={DEFAULT_RADIUS * 1000}
              />
            </Map>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
});
