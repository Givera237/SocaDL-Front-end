export type Site = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "online" | "offline" | "warning";
  weight?: number; // influence la taille du marqueur (ex: puissance installée)
};

export type LeafletMapInnerProps = {
  sites: Site[];
  center?: [number, number];
  zoom?: number;
};