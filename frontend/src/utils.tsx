export const INITIAL_X = 16.9252;
export const INITIAL_Y = 52.4064;

export const MIN_X = 14.1167;
export const MAX_X = 24.15;

export const MIN_Y = 49;
export const MAX_Y = 54.8334;

export const DEFAULT_RADIUS = 8;

enum ToponymType {
  District = 0,
  City = 1,
  State = 2,
}

type Toponym = {
  id: number;
  name: string;
  type: ToponymType;
};

type Purpose = {
  id: number;
  name: string;
};

type FilterRequest = Partial<{
  regionId: number;
  x: number;
  y: number;
  radius: number;
  minArea: number;
  maxArea: number;
  purposeId: number;
}>;

type Plot = {
  id: number;
  polygon: Record<number, number>[];
  area: number;
  purposeId: number;
};
