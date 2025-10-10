"use client";

import { useRouter } from "next/navigation";

import Icons from "../../components/Icons";
import { pageHeaderStyle as style } from "../css/pageHeader.css";

type Props = {
  title?: string;
  type?: "back" | "close";
  handler?: () => void;
};

function PageHeader({ title, type, handler }: Props) {
  const router = useRouter();
  const onClickButton = () => {
    if (handler) {
      handler();
      return;
    }
    router.back();
  };

  if (type === "close") {
    return (
      <header className={style.container}>
        <div className={style.button} data-empty="true" />
        <h1 className={style.title}>{title}</h1>
        <button type="button" className={style.button} onClick={onClickButton}>
          <Icons name="cross" w="regular" t="round" size={16} />
        </button>
      </header>
    );
  }

  return (
    <header className={style.container}>
      <button type="button" className={style.button} onClick={onClickButton}>
        <Icons name="angle-left" w="regular" t="round" size={16} />
      </button>
      <h1 className={style.title}>{title}</h1>
      <div className={style.button} data-empty="true" />
    </header>
  );
}

export default PageHeader;
