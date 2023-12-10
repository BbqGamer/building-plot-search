import { Map } from "leaflet";
import { Option } from "./components/Combobox";

export const INITIAL_X = 16.9252;
export const INITIAL_Y = 52.4064;

export const MIN_X = 14.1167;
export const MAX_X = 24.15;

export const MIN_Y = 49;
export const MAX_Y = 54.8334;

export const DEFAULT_RADIUS = 8;

export const fetchApiVersion = async () => {
  const result = await fetch(API_ROOT + "/version");
  const json = await result.json();
  return json;
};

export enum ToponymType {
  District = 0,
  City = 1,
  State = 2,
}

export type Toponym = {
  id: number;
  name: string;
  type: ToponymType;
};

const API_ROOT =
  import.meta.env.MODE === "development"
    ? `http://127.0.0.1:8080`
    : "https://api.plots.vrepetskyi.codes";

export const fetchToponyms = async () => {
  const result = await fetch(API_ROOT + "/districts");
  const json = await result.json();
  return json.map((x: Omit<Toponym, "type">) => ({
    ...x,
    type: 0,
  })) as Toponym[];
};

export type Purpose = {
  id: number;
  name: string;
};

export type PlotsRequest = Partial<{
  toponym: Option;
  x: number;
  y: number;
  radius: number;
  minArea: number;
  maxArea: number;
  purpose: Option;
}>;

type PlotsResponse = {
  id: string;
  district: number;
  area: number;
  plot_number: string;
  sheet: number;
  centroid: [number, number];
  geometry: [number, number][];
};

export type Plot = {
  id: string;
  topographyId: number;
  area: number;
  number: string;
  sheet: number;
  centroid: [number, number];
  polygon: [number, number][];
};

export const fetchPlots = async (request: PlotsRequest) => {
  const params = new URLSearchParams();

  params.set("district_id", String(request.toponym?.id || 0));
  params.set("min_area", String(request.minArea));
  params.set("max_area", String(request.maxArea));

  const result = await fetch(`${API_ROOT}/plots/?${params}`);

  const json = await result.json();

  const plots = json.map(
    (x: PlotsResponse): Plot => ({
      id: x.id,
      topographyId: x.district,
      area: x.area,
      number: x.plot_number,
      sheet: x.sheet,
      centroid: x.centroid,
      polygon: x.geometry,
    }),
  ) as Plot[];

  return plots;
};

export const flyTo = (map: Map | undefined, point: [number, number]) => {
  if (!map) return;

  const distance = map.distance(map.getCenter(), point);
  const targetZoom = Math.max(16, map.getZoom());

  if (distance < 10 && map.getZoom() === targetZoom) return;

  map.flyTo(point, targetZoom, {
    duration: 0.7,
  });
};
