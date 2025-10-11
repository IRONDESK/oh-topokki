"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";

import Icons from "@/share/components/Icons";
import { navigationStyle as style } from "@/share/layouts/navigation.css";
import { glassContainer } from "@/share/components/css/share.css";
import { overlay } from "overlay-kit";
import RestaurantRegisterForm from "@/components/restaurant/RestaurantForm";

function Navigation() {
  const params = useSearchParams();
  const tab = params.get("tab");

  const openRegisterForm = () => {
    overlay.open((controller) => (
      <RestaurantRegisterForm
          {...controller}
      />
    ));
  };

  return (
    <div className={style.container}>
      <button
        type="button"
        className={clsx(glassContainer, style.button)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
      >
        <Icons name="search" t="round" w="bold" size={20} />
        <span className={style.btnText}>검색</span>
      </button>
      <button
        type="button"
        className={clsx(glassContainer, style.mainButton)}
        data-flexible={true}
        onClick={tab ? () => {} : openRegisterForm}
      >
        <Icons name={tab ? "map" : "add"} t="round" w="solid" size={28} />
        {!tab && "새 맛집 등록"}
      </button>
      <button
        type="button"
        className={clsx(glassContainer, style.button)}
        data-flexible={true}
        style={{ paddingTop: "2px" }}
      >
        <Icons name="star" t="round" w="solid" size={20} />
        <span className={style.btnText}>즐겨찾기</span>
      </button>
    </div>
  );
}

export default Navigation;
