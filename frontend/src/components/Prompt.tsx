import { Map as LeafletMap } from "leaflet";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { LayerGroup, LayersControl, Polygon } from "react-leaflet";
import { useQuery } from "react-query";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  DEFAULT_RADIUS,
  INITIAL_X,
  INITIAL_Y,
  PlotsRequest,
  fetchPlots,
  flyTo,
} from "../helpers";
import { Filters } from "./Filters";
import { Map } from "./Map";
import { PlotCard } from "./PlotCard";

export type RequestState = {
  request: PlotsRequest;
  setRequest: Dispatch<SetStateAction<PlotsRequest>>;
};

export const Prompt = memo(() => {
  const mapRef = useRef<LeafletMap>();

  const setMap = useCallback((x: LeafletMap) => {
    mapRef.current = x;
  }, []);

  const onLayout = useCallback(() => {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 0);
  }, []);

  const [request, setRequest] = useState<PlotsRequest>({
    x: INITIAL_X,
    y: INITIAL_Y,
    radius: DEFAULT_RADIUS,
    minArea: 1000,
    maxArea: 5000,
  });

  const { data: plots } = useQuery(
    ["plots", request],
    () => fetchPlots(request),
    { keepPreviousData: true },
  );

  return (
    <PanelGroup direction="horizontal" onLayout={onLayout}>
      <Panel defaultSizePixels={471} minSizePixels={320} collapsible>
        <div className="h-full flex flex-col">
          <div className="flex flex-col mt-3 ml-3 mb-3">
            <div className="text-xl w-full flex items-baseline -mt-0.5">
              <h1>Building Plot Search</h1>
              <span className="ml-4 text-neutral-300 text-sm">
                UI v{APP_VERSION} / API v{APP_VERSION}
              </span>
            </div>
          </div>
          <div className="[direction:rtl] overflow-y-scroll pl-1.5 [&::-webkit-scrollbar-thumb]:rounded-l-none h-full pb-3">
            <div className="[direction:ltr] flex flex-col gap-2">
              <span className="w-full h-0.5 rounded-full bg-neutral-600" />
              <Filters request={request} setRequest={setRequest} />
              <span className="w-full h-0.5 rounded-full bg-neutral-600 my-2" />
              <h2>Statistics</h2>
              <span className="w-full h-0.5 rounded-full bg-neutral-600 my-2" />
              <div className="flex-1 gap-2 grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))]">
                {plots?.map((x) => (
                  <PlotCard
                    key={x.id}
                    id={x.id}
                    plot={x}
                    map={mapRef.current}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="!outline-none [&>div>span]:focus:bg-put-300">
        <div className="h-full w-3 flex flex-col gap-1 items-end justify-center [&:hover>span]:bg-neutral-400">
          <span className="h-12 w-1.5 bg-neutral-500 rounded-l-full" />
        </div>
      </PanelResizeHandle>
      <Panel minSizePixels={400} collapsible>
        <Map setMap={setMap}>
          <LayersControl.Overlay name="Plots" checked>
            <LayerGroup>
              {plots?.map((x) => (
                <Polygon
                  key={x.id}
                  color="#08aeff"
                  fillColor="#fff"
                  weight={2}
                  positions={x.polygon}
                  eventHandlers={{
                    mousedown: (e) => e.originalEvent.preventDefault(),
                    click: () => {
                      flyTo(mapRef.current, x.centroid);

                      const listItem = document.getElementById(x.id);

                      if (!listItem) return;

                      listItem.scrollIntoView({
                        block: "center",
                        behavior: "smooth",
                      });

                      setTimeout(() => {
                        listItem.focus();
                      }, 700);
                    },
                  }}
                />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          {/* <Circle
            center={[request.y!, request.x!]}
            color="#404040"
            fill={false}
            radius={request.radius! * 1000}
          /> */}
        </Map>
      </Panel>
    </PanelGroup>
  );
});
