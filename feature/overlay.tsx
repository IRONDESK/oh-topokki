import { overlay as overlayKit } from "overlay-kit";
import { Dialog, DialogCommon } from "@/share/components/Dialog";

const confirm = (param: DialogCommon) =>
  overlayKit.openAsync<boolean>((controller) => (
    <Dialog
      title={param.title}
      contents={param.contents}
      type="confirm"
      {...controller}
    />
  ));

const alert = (param: DialogCommon) =>
  overlayKit.open((controller) => (
    <Dialog
      title={param.title}
      contents={param.contents}
      type="alert"
      {...controller}
    />
  ));

export const overlay = {
  confirm,
  alert,
};
