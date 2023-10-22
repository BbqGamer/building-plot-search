import { Map as LeafletMap } from "leaflet";
import { memo, useCallback, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Map } from "./components/Map";

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
        <span className="h-6 mx-4 w-[1px] bg-neutral-100 rounded-full" />
        <div className="font-normal flex gap-4">
          <button>Guide</button>
          <button>Settings</button>
          <button>Contacts</button>
        </div>
      </div>
      <PanelGroup direction="horizontal" units="pixels" {...{ onLayout }}>
        <Panel defaultSize={500} minSize={300} maxSize={900} collapsible>
          <div className="h-full flex flex-col gap-4 pl-4">
            <div className="flex-1 bg-neutral-700 rounded-md p-4">
              <h2>Filters</h2>
            </div>
            <div className="flex-1 bg-neutral-700 rounded-md p-4">
              <h2>Results</h2>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle>
          <div className="h-full w-4 flex items-center justify-center">
            <span className="h-8 w-1 rounded-full bg-neutral-100" />
          </div>
        </PanelResizeHandle>
        <Panel>
          <div className="h-full rounded-md overflow-hidden relative mr-4">
            <Map {...{ setMap }} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
});
