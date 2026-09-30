import { ReactNode } from "react";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import {
  NOODLE_TYPE,
  RICE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
} from "@/shared/constants/restaurant";
import { openNaverMap } from "@/shared/lib/naver-map-link";
import Icons from "@/shared/ui/Icons";

const SPICINESS_DESCRIPTION: Record<number, string> = {
  0: "외국인도 누구나 즐겨요",
  1: "진라면 정도로 매워요",
  2: "신라면 정도로 매워요",
  3: "신라면보다 약간 더 매워요",
  4: "불닭볶음면 정도로 매워요",
  5: "불닭보다 훨씬 매워요",
};
const MAX_SPICINESS = 5;

const labels = (values: string[], dict: Record<string, string>) =>
  values.map((v) => dict[v] ?? v).join(", ");

type Row = { label: string; value: ReactNode };

/** 값이 있는 항목만 만든다 — 데이터가 없으면 라벨도 보이지 않게 */
function buildRows(r: ResponseRestaurant): Row[] {
  const rows: (Row | false)[] = [
    {
      label: "주소",
      value: (
        <>
          {r.address}
          <button
            type="button"
            onClick={() => openNaverMap(r)}
            className="cursor-pointer ml-1.5 inline-flex items-center whitespace-nowrap align-baseline text-gray-500 hover:text-gray-700"
          >
            네이버지도
            <Icons name="angle-small-right" w="regular" size={15} />
          </button>
        </>
      ),
    },
    !!r.phoneNumber && {
      label: "전화",
      value: (
        <a href={`tel:${r.phoneNumber}`} className="underline-offset-2 hover:underline">
          {r.phoneNumber}
        </a>
      ),
    },
    r.riceTypes.length > 0 && { label: "떡 종류", value: labels(r.riceTypes, RICE_TYPE) },
    r.sauceTypes.length > 0 && { label: "소스 종류", value: labels(r.sauceTypes, SAUCE_TYPE) },
    r.noodleTypes.length > 0 && { label: "면 종류", value: labels(r.noodleTypes, NOODLE_TYPE) },
    r.spiciness != null && {
      label: "매운 정도",
      value: (
        <span className="flex flex-col gap-1">
          <span className="flex items-center gap-0.5" aria-label={`매운맛 ${r.spiciness}단계`}>
            {Array.from({ length: MAX_SPICINESS }, (_, i) => (
              <Icons
                key={i}
                name="pepper"
                w="solid"
                size={14}
                color={i < r.spiciness ? "var(--color-primary-500)" : "var(--color-gray-200)"}
              />
            ))}
          </span>
          <span>
            {SPICINESS_DESCRIPTION[r.spiciness]}
            {r.canChangeSpicy && <span className="text-gray-500"> · 맵기 조절 가능</span>}
          </span>
        </span>
      ),
    },
    !!r.sundaeType && { label: "순대", value: SUNDAE_TYPE[r.sundaeType] },
    r.sideMenus.length > 0 && { label: "사이드메뉴", value: labels(r.sideMenus, SIDE_MENU_TYPE) },
    r.others.length > 0 && { label: "기타", value: r.others.join(", ") },
  ];
  return rows.filter((row): row is Row => !!row);
}

/** 주소·전화 + 떡·소스·면·맵기·순대·사이드 등 떡볶이 속성 목록 */
export default function DetailInfo({
  restaurant,
}: {
  restaurant: ResponseRestaurant;
}) {
  return (
    <dl className="grid grid-cols-[84px_1fr] gap-x-3 gap-y-3.5 text-[15px] leading-snug">
      {buildRows(restaurant).map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-gray-500">{label}</dt>
          <dd className="min-w-0 text-gray-900 break-keep">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
