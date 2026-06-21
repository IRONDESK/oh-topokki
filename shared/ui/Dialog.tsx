import type { ComponentProps } from "react";
import type {
  OverlayAsyncControllerComponent,
  OverlayControllerComponent,
} from "overlay-kit";
import { buttons } from "@/shared/style/variants";

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
      onClick={type === "confirm" ? undefined : () => handleClose}
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-[2500]"
    >
      <div className="flex flex-col gap-5 min-w-[320px] max-w-[360px] rounded-[20px] bg-white py-5 px-4 mx-4 items-stretch whitespace-pre-wrap">
        <div className="flex flex-col gap-2 justify-start items-start px-2">
          <p className="text-xl font-semibold text-gray-700">{title}</p>
          {contents && (
            <p className="text-base font-normal text-gray-600">{contents}</p>
          )}
        </div>
        <div className="flex gap-2">
          {type === "confirm" && (
            <button
              type="button"
              className={buttons({ fill: "secondary", size: "medium" })}
              onClick={() => close(false)}
            >
              {btnText?.cancel ?? "취소"}
            </button>
          )}
          <button
            type="button"
            className={buttons({ fill: "primary", size: "medium" })}
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
