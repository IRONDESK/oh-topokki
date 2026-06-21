import clsx from "clsx";
import { ReactNode } from "react";

import { fonts } from "@/shared/style/typo.css";
import { formStyle } from "@/features/restaurant/ui/formStep/form.css";

export type FieldStatus = "fold-value" | "fold" | "unfold";

interface FieldShellProps {
  title: string;
  detailTitle: string;
  status: FieldStatus;
  foldedValue?: ReactNode;
  children: ReactNode;
}

export const FieldShell = ({
  title,
  detailTitle,
  status,
  foldedValue,
  children,
}: FieldShellProps) => {
  const isUnfold = status === "unfold";

  return (
    <div className={formStyle.fieldContainer} data-fold={!isUnfold}>
      <div className={formStyle.fieldTitleBox}>
        <h4
          className={clsx(fonts.body3.medium, formStyle.fieldTitle)}
          data-visible={!isUnfold}
        >
          {title}
        </h4>
        <h4
          className={clsx(
            fonts.head6.semibold,
            formStyle.fieldTitle,
            formStyle.fieldDetailTitle,
          )}
          data-visible={isUnfold}
        >
          {detailTitle}
        </h4>
      </div>

      <div style={{ display: isUnfold ? undefined : "none", width: "100%" }}>
        {children}
      </div>

      {foldedValue !== undefined && (
        <div className={formStyle.fieldValue} data-hide={isUnfold}>
          {foldedValue}
        </div>
      )}
    </div>
  );
};
