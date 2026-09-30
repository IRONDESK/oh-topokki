import { SearchRestaurantFilters } from "@/shared/api/model/restaurant";
import {
  RICE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
  TOPOKKI_TYPE,
} from "@/shared/constants/restaurant";
import { buttons } from "@/shared/style/variants";

// 매운맛은 단계(1~5)를 직접 고르게 하지 않고 구간으로 추상화한다.
// (검색하는 입장에선 "안 매운 곳/매운 곳"이 관심사이지 정확한 단계가 아님)
const SPICY_OPTIONS = [
  { value: "mild", label: "순한 편", params: { maxSpiciness: 2 } },
  { value: "medium", label: "보통", params: { minSpiciness: 3, maxSpiciness: 3 } },
  { value: "hot", label: "매운 편", params: { minSpiciness: 4 } },
] as const;

const SECTIONS = [
  { key: "topokkiType", label: "종류", options: TOPOKKI_TYPE },
  { key: "riceTypes", label: "떡", options: RICE_TYPE },
  { key: "sauceTypes", label: "소스", options: SAUCE_TYPE },
  { key: "spicy", label: "매운맛", options: null },
  {
    key: "sundaeType",
    label: "순대",
    options: { exists: "파는 곳 전부", ...SUNDAE_TYPE },
  },
  { key: "sideMenus", label: "사이드메뉴", options: SIDE_MENU_TYPE },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

const optionChipCls =
  "shrink-0 select-none cursor-pointer px-2.5 py-1 rounded-chip text-sm font-medium border bg-white border-gray-200 text-gray-600 transition-colors data-[selected=true]:bg-primary-500 data-[selected=true]:border-ink data-[selected=true]:text-white data-[selected=true]:font-semibold";

function spicyValue(filters: SearchRestaurantFilters) {
  return (
    SPICY_OPTIONS.find(
      (o) =>
        ((o.params as { minSpiciness?: number }).minSpiciness ?? null) ===
          (filters.minSpiciness ?? null) &&
        ((o.params as { maxSpiciness?: number }).maxSpiciness ?? null) ===
          (filters.maxSpiciness ?? null),
    )?.value ?? null
  );
}

/** 적용된 필터를 태그 목록으로 변환 (결과 화면 상단 요약용) */
export function activeFilterTags(
  filters: SearchRestaurantFilters,
): { id: string; label: string; remove: (f: SearchRestaurantFilters) => SearchRestaurantFilters }[] {
  const tags = [];
  if (filters.topokkiType) {
    tags.push({
      id: `topokkiType`,
      label: TOPOKKI_TYPE[filters.topokkiType],
      remove: (f: SearchRestaurantFilters) => ({ ...f, topokkiType: null }),
    });
  }
  if (filters.riceTypes) {
    tags.push({
      id: `riceTypes`,
      label: RICE_TYPE[filters.riceTypes],
      remove: (f: SearchRestaurantFilters) => ({ ...f, riceTypes: null }),
    });
  }
  if (filters.sauceTypes) {
    tags.push({
      id: `sauceTypes`,
      label: SAUCE_TYPE[filters.sauceTypes],
      remove: (f: SearchRestaurantFilters) => ({ ...f, sauceTypes: null }),
    });
  }
  const spicy = spicyValue(filters);
  if (spicy) {
    tags.push({
      id: `spicy`,
      label: `매운맛 ${SPICY_OPTIONS.find((o) => o.value === spicy)!.label}`,
      remove: (f: SearchRestaurantFilters) => ({
        ...f,
        minSpiciness: null,
        maxSpiciness: null,
      }),
    });
  }
  if (filters.sundaeType) {
    tags.push({
      id: `sundaeType`,
      label:
        filters.sundaeType === "exists"
          ? "순대 파는 곳"
          : `순대 · ${SUNDAE_TYPE[filters.sundaeType]}`,
      remove: (f: SearchRestaurantFilters) => ({ ...f, sundaeType: null }),
    });
  }
  for (const menu of filters.sideMenus ?? []) {
    tags.push({
      id: `sideMenus:${menu}`,
      label: SIDE_MENU_TYPE[menu],
      remove: (f: SearchRestaurantFilters) => {
        const next = (f.sideMenus ?? []).filter((v) => v !== menu);
        return { ...f, sideMenus: next.length > 0 ? next : null };
      },
    });
  }
  return tags;
}

type Props = {
  filters: SearchRestaurantFilters;
  onChange: (next: SearchRestaurantFilters) => void;
  onApply: () => void;
  onReset: () => void;
  /** 현재 조건의 결과 수. 아직 모르면 null. */
  resultCount: number | null;
};

function SearchFilter({ filters, onChange, onApply, onReset, resultCount }: Props) {
  const toggleOption = (key: SectionKey, value: string) => {
    if (key === "spicy") {
      const current = spicyValue(filters);
      const next = { ...filters, minSpiciness: null, maxSpiciness: null };
      if (current !== value) {
        Object.assign(
          next,
          SPICY_OPTIONS.find((o) => o.value === value)!.params,
        );
      }
      onChange(next);
      return;
    }
    if (key === "sideMenus") {
      const list = filters.sideMenus ?? [];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      onChange({ ...filters, sideMenus: next.length > 0 ? next : null });
      return;
    }
    onChange({ ...filters, [key]: filters[key] === value ? null : value });
  };

  const isSelected = (key: SectionKey, value: string) => {
    if (key === "spicy") return spicyValue(filters) === value;
    if (key === "sideMenus") return (filters.sideMenus ?? []).includes(value);
    return filters[key] === value;
  };

  return (
    <div className="flex flex-col gap-4 pt-1">
      {SECTIONS.map((section) => (
        <section key={section.key} className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-gray-500">
            {section.label}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {(section.key === "spicy"
              ? SPICY_OPTIONS.map((o) => [o.value, o.label] as const)
              : Object.entries(section.options as Record<string, string>)
            ).map(([value, label]) => (
              <li key={value}>
                <button
                  type="button"
                  className={optionChipCls}
                  data-selected={isSelected(section.key, value)}
                  onClick={() => toggleOption(section.key, value)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="sticky bottom-0 flex gap-2 pt-2.5 pb-3 bg-white">
        <button
          type="button"
          className={buttons({ fill: "assistive", size: "medium" })}
          style={{ flex: "0 0 auto" }}
          onClick={onReset}
        >
          초기화
        </button>
        <button
          type="button"
          className={buttons({ fill: "primary", size: "medium" })}
          onClick={onApply}
        >
          {resultCount !== null ? `${resultCount}곳 보기` : "결과 보기"}
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
