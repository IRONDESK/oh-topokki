import React from "react";
import Icons from "@/shared/ui/Icons";

type Props = {
  children: React.ReactNode;
  close: () => void;
  unmount: () => void;
  isOpen: boolean;
  headerBgColor?: string;
};

export const Modal = (props: Props) => {
  const { children, headerBgColor } = props;

  const handleClose = () => {
    props.close();
  };

  if (!props.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-2000 py-5">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white overflow-hidden pb-[env(safe-area-inset-bottom,20px)] flex flex-col z-20 w-screen min-h-screen rounded-none xl:w-full xl:max-w-[var(--size-overlay-max)] xl:p-0 xl:min-h-[95vh] xl:h-[95vh] xl:rounded-card xl:border-[1.5px] xl:border-ink"
      >
        <div
          className="flex justify-between items-start pt-[calc(18px+env(safe-area-inset-top))] px-3.5 pb-3"
          style={{ backgroundColor: headerBgColor }}
        >
          <div></div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="창 닫기"
            className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Icons w="regular" t="straight" name="cross" size={20} />
          </button>
        </div>
        <div className="flex flex-col items-start justify-start flex-1 overflow-y-auto pt-4 px-5 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};
