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
  | ({ type: "alert" } & DialogCommon & AlertBaseProps & { btnText?: string })
  | ({
      type: "confirm";
    } & DialogCommon &
      ConfirmBaseProps & { btnText?: { confirm?: string; cancel?: string } });

export const Dialog = (props: DialogProps) => {
  const { type, isOpen, close, title, contents, btnText } = props;
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
              {btnText?.cancel ?? "취소"}
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
            {(typeof btnText === "string" ? btnText : btnText?.confirm) ??
              "확인"}
          </button>
        </div>
      </div>
    </section>
  );
};
