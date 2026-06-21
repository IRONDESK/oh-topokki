import { PlaceField } from "@/features/restaurant/ui/formStep/place-fields";
import { FieldStatus } from "@/features/restaurant/ui/formStep/fields/FieldShell";
import { SelectField } from "@/features/restaurant/ui/formStep/fields/SelectField";
import { TextField } from "@/features/restaurant/ui/formStep/fields/TextField";
import { SpicyRangeField } from "@/features/restaurant/ui/formStep/fields/SpicyRangeField";
import { TextGroupField } from "@/features/restaurant/ui/formStep/fields/TextGroupField";
import { TextareaField } from "@/features/restaurant/ui/formStep/fields/TextareaField";

type Props = PlaceField & { status?: FieldStatus };

export const FieldSection = (props: Props) => {
  const { status = "unfold", ...field } = props;

  switch (field.type) {
    case "radio":
    case "checkbox":
      return <SelectField {...field} status={status} />;
    case "text":
    case "number":
      return <TextField {...field} status={status} />;
    case "spicy-range":
      return <SpicyRangeField {...field} status={status} />;
    case "text-group":
      return <TextGroupField {...field} status={status} />;
    case "textarea":
      return <TextareaField {...field} status={status} />;
  }
};
