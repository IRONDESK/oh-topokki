import type { ComponentProps } from "react";
import type {
  OverlayAsyncControllerComponent,
  OverlayControllerComponent,
} from "overlay-kit";
import { dialogStyle } from "@/share/components/css/dialog.css";
import { flexs } from "@/style/container.css";
import { buttons } from "@/share/components/css/share.css";

type AlertBaseProps = ComponentProps<OverlayControllerComponent>;
type ConfirmBaseProps = ComponentProps<
  OverlayAsyncControllerComponent<boolean>
>;
export type DialogCommon = {
  title: string;
  contents?: string;
};

export type DialogProps =
  | ({ type: "alert" } & DialogCommon & AlertBaseProps)
  | ({
      type: "confirm";
    } & DialogCommon &
      ConfirmBaseProps);

export const Dialog = (props: DialogProps) => {
  const { type, isOpen, close, title, contents } = props;
  const handleClose = (resolve: boolean) => {
    if (type === "confirm") {
      close(resolve);
    } else {
      close();
    }
  };

  if (!isOpen) return null;
  return (
    <section
      className={dialogStyle.dim}
      onClick={type === "confirm" ? undefined : () => handleClose}
    >
      <div className={dialogStyle.container}>
        <div className={dialogStyle.inner}>
          <p className={dialogStyle.title}>{title}</p>
          {contents && <p className={dialogStyle.contents}>{contents}</p>}
        </div>
        <div className={flexs({ gap: "8" })}>
          {type === "confirm" && (
            <button
              type="button"
              className={buttons({
                fill: "secondary",
                size: "medium",
              })}
              onClick={() => close(false)}
            >
              취소
            </button>
          )}
          <button
            type="button"
            className={buttons({
              fill: "primary",
              size: "medium",
            })}
            onClick={() => handleClose(true)}
          >
            확인
          </button>
        </div>
      </div>
    </section>
  );
};
