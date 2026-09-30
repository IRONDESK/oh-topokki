import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import {
  NOODLE_TYPE,
  RICE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
} from "@/shared/constants/restaurant";
import Icons from "@/shared/ui/Icons";
import Tag from "@/shared/ui/Tag";

const DETAIL_ITEMS_CLS =
  "px-5 grid grid-cols-[min(30%,100px)_1fr] gap-x-1.5 gap-y-3 text-base font-normal [&>dt]:font-semibold [&>dt]:text-gray-600";
const TAGS_CLS = "flex gap-1.5 justify-start items-center flex-wrap";

const SPICINESS_DESCRIPTION: Record<number, string> = {
  0: "외국인도 누구나 즐겨요",
  1: "진라면 정도로 매워요",
  2: "신라면 정도로 매워요",
  3: "신라면보다 약간 더 매워요",
  4: "불닭볶음면 정도로 매워요",
  5: "불닭보다 훨씬 매워요",
};

const labels = (values: string[], dict: Record<string, string>) =>
  values.map((v) => dict[v] ?? v).join(", ");

/** 떡·소스·면·맵기·순대·사이드 등 떡볶이 속성 목록 */
export default function DetailInfo({
  restaurant,
}: {
  restaurant: ResponseRestaurant;
}) {
  return (
    <dl className={DETAIL_ITEMS_CLS}>
      <dt>떡 종류</dt>
      <dd>{labels(restaurant.riceTypes, RICE_TYPE)}</dd>
      <dt>소스 종류</dt>
      <dd>{labels(restaurant.sauceTypes, SAUCE_TYPE)}</dd>
      {restaurant.noodleTypes.length > 0 && (
        <>
          <dt>면 종류</dt>
          <dd>{labels(restaurant.noodleTypes, NOODLE_TYPE)}</dd>
        </>
      )}
      <dt>매운 정도</dt>
      <dd>
        <p className="flex gap-1 justify-start items-center">
          {Array.from({ length: 6 }, (_, level) => (
            <span
              key={level}
              data-active={restaurant.spiciness >= level}
              className="text-primary-200 data-[active=true]:text-primary-600"
            >
              <Icons name="pepper" w="solid" size={18} />
            </span>
          ))}
        </p>
        <p className="text-sm font-medium text-primary-500">
          {SPICINESS_DESCRIPTION[restaurant.spiciness]}
        </p>
      </dd>
      <dt>순대</dt>
      <dd>
        {restaurant.sundaeType
          ? SUNDAE_TYPE[restaurant.sundaeType]
          : "순대는 없어요"}
      </dd>
      <dt>사이드메뉴</dt>
      <dd className={TAGS_CLS}>
        {restaurant.sideMenus.map((menu) => (
          <Tag key={menu} fill="assistive">
            {SIDE_MENU_TYPE[menu] ?? menu}
          </Tag>
        ))}
      </dd>
      <dt>기타</dt>
      <dd className={TAGS_CLS}>
        {restaurant.others.map((menu) => (
          <Tag key={menu} fill="assistive">
            {menu}
          </Tag>
        ))}
      </dd>
    </dl>
  );
}
