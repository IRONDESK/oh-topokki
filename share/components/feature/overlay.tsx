import { overlay as overlayKit } from "overlay-kit";
import { Dialog, DialogCommon } from "@/share/components/Dialog";

const confirm = (
  props: DialogCommon & { btnText?: { confirm?: string; cancel?: string } },
) =>
  overlayKit.openAsync<boolean>((controller) => (
    <Dialog
      title={props.title}
      contents={props.contents}
      btnText={props.btnText}
      type="confirm"
      {...controller}
    />
  ));

const alert = (props: DialogCommon & { btnText?: string }) =>
  overlayKit.open((controller) => (
    <Dialog
      title={props.title}
      contents={props.contents}
      btnText={props.btnText}
      type="alert"
      {...controller}
    />
  ));

export const overlay = {
  confirm,
  alert,
};
