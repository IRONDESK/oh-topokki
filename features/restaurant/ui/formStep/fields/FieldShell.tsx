import clsx from "clsx";
import { ReactNode } from "react";

export type FieldStatus = "fold-value" | "fold" | "unfold";

interface FieldShellProps {
  title: string;
  detailTitle: string;
  status: FieldStatus;
  foldedValue?: ReactNode;
  children: ReactNode;
}

const CONTAINER_CLS =
  "flex flex-col gap-1.5 items-start w-full transition-all duration-[0.25s] data-[fold=true]:flex-row data-[fold=true]:justify-between";

const TITLE_BOX_CLS =
  "grid items-center justify-center [grid-template-areas:'overlap']";

const TITLE_BASE_CLS =
  "[grid-area:overlap] text-left transition-all duration-[0.25s] data-[visible=true]:opacity-100 data-[visible=false]:opacity-0 data-[visible=false]:p-0";

const FOLDED_VALUE_CLS =
  "flex items-center justify-center h-8 text-base font-normal text-primary-500 transition-opacity duration-[0.25s] data-[hide=true]:opacity-0";

export const FieldShell = ({
  title,
  detailTitle,
  status,
  foldedValue,
  children,
}: FieldShellProps) => {
  const isUnfold = status === "unfold";

  return (
    <div className={CONTAINER_CLS} data-fold={!isUnfold}>
      <div className={TITLE_BOX_CLS}>
        <h4
          data-visible={!isUnfold}
          className={clsx(TITLE_BASE_CLS, "text-base font-medium")}
        >
          {title}
        </h4>
        <h4
          data-visible={isUnfold}
          className={clsx(
            TITLE_BASE_CLS,
            "text-2xl font-semibold pt-8 pb-2.5",
          )}
        >
          {detailTitle}
        </h4>
      </div>

      <div style={{ display: isUnfold ? undefined : "none", width: "100%" }}>
        {children}
      </div>

      {foldedValue !== undefined && (
        <div className={FOLDED_VALUE_CLS} data-hide={isUnfold}>
          {foldedValue}
        </div>
      )}
    </div>
  );
};
