import { atom } from "jotai";

interface MapFilterItems {
  topokkiType: string | null;
  riceType: string | null;
  noodleType: string | null;
  maxPrice: number | null;
  side: string[] | null;
}
export const mapFilterAtom = atom<MapFilterItems>({
  topokkiType: null,
  riceType: null,
  noodleType: null,
  maxPrice: null,
  side: null,
});
