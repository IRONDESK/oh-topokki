"use client";

import { useRouter } from "next/navigation";

import Icons from "@/shared/ui/Icons";

type Props = {
  title?: string;
  type?: "back" | "close";
  handler?: () => void;
};

const containerCls =
  "flex justify-between items-center min-h-16 pt-[calc(env(safe-area-inset-top)+8px)] px-4 pb-2 border-b border-gray-100";

const titleCls = "text-center text-base font-medium text-gray-700";

const buttonCls =
  "cursor-pointer w-6 h-6 inline-flex items-center justify-center data-[empty=true]:cursor-default data-[empty=true]:invisible";

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
      <header className={containerCls}>
        <div className={buttonCls} data-empty="true" />
        <h1 className={titleCls}>{title}</h1>
        <button type="button" className={buttonCls} onClick={onClickButton}>
          <Icons name="cross" w="regular" t="round" size={16} />
        </button>
      </header>
    );
  }

  return (
    <header className={containerCls}>
      <button type="button" className={buttonCls} onClick={onClickButton}>
        <Icons name="angle-left" w="regular" t="round" size={16} />
      </button>
      <h1 className={titleCls}>{title}</h1>
      <div className={buttonCls} data-empty="true" />
    </header>
  );
}

export default PageHeader;
