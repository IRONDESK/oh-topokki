import Image from "next/image";
import { buttons } from "@/shared/style/variants";
import { openNaverMap } from "@/shared/lib/naver-map-link";
import NaverMapIcon from "@/assets/navermap.webp";

type Props = {
  place: Parameters<typeof openNaverMap>[0];
  label?: string;
};

/** 네이버 지도 앱(없으면 웹)으로 장소를 여는 버튼 */
export default function NaverMapButton({ place, label = "지도앱" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // 리스트 아이템 클릭(지도 이동)과 분리
        openNaverMap(place);
      }}
      className={buttons({ fill: "assistive", size: "medium" })}
    >
      <Image src={NaverMapIcon} alt="" width={26} height={26} />
      {label}
    </button>
  );
}
