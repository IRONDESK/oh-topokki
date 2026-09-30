import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/shared/lib/cn";
import { TERMS_VERSIONS } from "@/features/legal/model/terms";
import { PRIVACY_VERSIONS } from "@/features/legal/model/privacy";
import LegalDocumentView from "@/features/legal/ui/LegalDocumentView";

export type LegalTab = "terms" | "privacy";

const TABS: { value: LegalTab; label: string }[] = [
  { value: "terms", label: "서비스 이용약관" },
  { value: "privacy", label: "개인정보 처리방침" },
];

const TAB_CLS =
  "cursor-pointer flex-1 py-3 text-base font-medium text-gray-400 transition-colors data-[active]:text-ink data-[active]:font-semibold";

type Props = {
  defaultTab?: LegalTab;
  // 스크롤 컨테이너 안에서 탭 목록을 상단에 고정할 때의 배경/여백 보정
  listClassName?: string;
};

/** 이용약관 / 개인정보 처리방침 탭 */
export default function LegalTabs({ defaultTab = "terms", listClassName }: Props) {
  return (
    <Tabs.Root defaultValue={defaultTab} className="w-full flex flex-col">
      <Tabs.List
        className={cn(
          "sticky top-0 z-10 flex bg-white border-b border-gray-200",
          listClassName,
        )}
      >
        {TABS.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value} className={TAB_CLS}>
            {tab.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className="absolute bottom-[-1px] left-(--active-tab-left) w-(--active-tab-width) h-0.5 bg-primary-500 transition-[left,width] duration-200" />
      </Tabs.List>
      <Tabs.Panel value="terms" className="pt-5 pb-8">
        <LegalDocumentView versions={TERMS_VERSIONS} />
      </Tabs.Panel>
      <Tabs.Panel value="privacy" className="pt-5 pb-8">
        <LegalDocumentView versions={PRIVACY_VERSIONS} showHistory />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
