import { Map as LeafletMap } from "leaflet";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { Circle, Polygon } from "react-leaflet";
import { useQuery } from "react-query";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  DEFAULT_RADIUS,
  INITIAL_X,
  INITIAL_Y,
  PlotsRequest,
  fetchPlots,
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
    mapRef.current?.invalidateSize();
  }, []);

  const [request, setRequest] = useState<PlotsRequest>({
    x: INITIAL_X,
    y: INITIAL_Y,
    radius: DEFAULT_RADIUS,
    minArea: 0,
    maxArea: 999999,
  });

  const { data: plots } = useQuery(
    ["plots", request],
    () => fetchPlots(request),
    { keepPreviousData: true },
  );

  return (
    <PanelGroup direction="horizontal" units="pixels" onLayout={onLayout}>
      <Panel defaultSize={400} minSize={400} collapsible>
        <div className="h-full flex flex-col gap-4 pl-4">
          <div className="bg-neutral-700 rounded-md p-4">
            <Filters request={request} setRequest={setRequest} />
          </div>
          <div className="flex-1 bg-neutral-700 rounded-md p-4 pr-3 overflow-x-hidden overflow-y-scroll gap-2 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
            {plots?.length
              ? plots.map((x) => (
                  <PlotCard
                    key={x.id}
                    id={x.id}
                    plot={x}
                    map={mapRef.current}
                  />
                ))
              : "No plots match the query"}
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="focus:outline-none [&>div>span]:focus:bg-blue-400">
        <div className="h-full w-4 flex items-center justify-center">
          <span className="h-8 w-1 rounded-full bg-neutral-100" />
        </div>
      </PanelResizeHandle>
      <Panel minSize={400} collapsible>
        <div className="h-full mr-4">
          <Map setMap={setMap}>
            {plots?.map((x) => (
              <Polygon
                key={x.id}
                color="#60a5fa"
                positions={x.polygon}
                eventHandlers={{
                  click: () => {
                    mapRef.current?.flyTo([x.centroid[1], x.centroid[0]], 17, {
                      duration: 0.3,
                    });

                    const listItem = document.getElementById(x.id);

                    listItem?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });

                    setTimeout(() => {
                      listItem?.focus();
                    }, 300);
                  },
                }}
              />
            ))}
            <Circle
              center={[request.y!, request.x!]}
              color="#404040"
              fill={false}
              radius={request.radius! * 1000}
            />
          </Map>
        </div>
      </Panel>
    </PanelGroup>
  );
});
