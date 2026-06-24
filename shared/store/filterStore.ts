import { atom } from "jotai";

interface MapFilterItems {
  topokkiType: string | null;
  riceTypes: string | null;
  sauceTypes: string | null;
  noodleTypes: string | null;
  sundaeType: string | null;
  maxPrice: number | null;
  sideMenus: string[] | null;
}
export const mapFilterAtom = atom<MapFilterItems>({
  topokkiType: null,
  riceTypes: null,
  sauceTypes: null,
  noodleTypes: null,
  sundaeType: null,
  maxPrice: null,
  sideMenus: null,
});
