import React from "react";
import Icons from "@/share/components/Icons";
import { overlayStyle } from "@/share/components/css/modal.css";

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
    <div className={overlayStyle.dim}>
      <div className={overlayStyle.modal} onClick={(e) => e.stopPropagation()}>
        <div
          className={overlayStyle.header}
          style={{ backgroundColor: headerBgColor }}
        >
          <div></div>
          <button
            className={overlayStyle.closeButton}
            onClick={handleClose}
            aria-label="창 닫기"
          >
            <Icons w="regular" t="straight" name="cross" size={20} />
          </button>
        </div>
        <div className={overlayStyle.content}>{children}</div>
      </div>
    </div>
  );
};
