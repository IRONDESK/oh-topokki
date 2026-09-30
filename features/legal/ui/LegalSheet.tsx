import ScrolledBottomSheet, {
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import LegalTabs, { type LegalTab } from "@/features/legal/ui/LegalTabs";

type Props = {
  controller: SheetController;
  tab: LegalTab;
};

/** 회원가입 화면에서 약관/방침을 확인하는 바텀시트 */
export default function LegalSheet({ controller, tab }: Props) {
  return (
    <ScrolledBottomSheet controller={controller}>
      {() => (
        <div className="px-5">
          <LegalTabs defaultTab={tab} listClassName="-mx-5 px-5" />
        </div>
      )}
    </ScrolledBottomSheet>
  );
}
