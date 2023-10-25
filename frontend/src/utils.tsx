export const DEFAULT_RADIUS = 8;

enum LocationType {
  District = 0,
  City = 1,
  State = 2,
}

type Location = {
  id: number;
  name: string;
  type: LocationType;
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
