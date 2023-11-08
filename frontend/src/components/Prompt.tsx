import { Map as LeafletMap } from "leaflet";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import { Circle } from "react-leaflet";
import { useQuery } from "react-query";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  DEFAULT_RADIUS,
  INITIAL_X,
  INITIAL_Y,
  PlotsRequest,
  fetchPlots,
  fetchToponyms,
} from "../utils";
import { Filters } from "./Filters";
import { Map } from "./Map";

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

  const { data: toponyms } = useQuery(["toponyms"], fetchToponyms);

  const { data: plots } = useQuery(["plots", request], () =>
    fetchPlots(request),
  );

  return (
    <PanelGroup direction="horizontal" units="pixels" onLayout={onLayout}>
      <Panel defaultSize={400} minSize={400} collapsible>
        <div className="h-full flex flex-col gap-4 pl-4">
          <div className="bg-neutral-700 rounded-md p-4">
            <Filters request={request} setRequest={setRequest} />
          </div>
          <div className="flex-1 bg-neutral-700 rounded-md p-4 pr-3 overflow-x-hidden overflow-y-scroll flex flex-col gap-2">
            {plots?.length
              ? plots.map((x) => (
                  <a
                    key={x.id}
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${x.centroid[1]},${x.centroid[0]}`}
                    target="_blank"
                    className="select-text grid grid-cols-[auto_1fr] gap-x-8 p-4 rounded-md bg-neutral-600"
                    draggable={false}
                  >
                    <span>ID:</span>
                    <span>{x.id}</span>
                    <span>Sheet:</span>
                    <span>{x.sheet}</span>
                    <span>Number:</span>
                    <span>{x.number}</span>
                    <span>District:</span>
                    <span>
                      {toponyms?.find((y) => y.id === x.topographyId)?.name ||
                        "Unknown"}
                    </span>
                    <span>Area:</span>
                    <span>
                      {x.area.toFixed(2)} m<sup>2</sup>
                    </span>
                  </a>
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
            {/* {plots?.map((x) => (
              <Polygon key={x.id} color="green" positions={x.polygon} />
            ))} */}
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
