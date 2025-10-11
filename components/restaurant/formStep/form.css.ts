import { globalStyle, style } from "@vanilla-extract/css";
import { flexs } from "@/style/container.css";
import { theme } from "@/style/theme.css";
import { fonts } from "@/style/typo.css";

const formTitle = style([
  fonts.head5.semibold,
  {
    margin: "32px 0 26px",
  },
]);
const fieldContainer = style([
  flexs({ dir: "col", gap: "6", align: "start" }),
  {
    width: "100%",
    transition: "all 0.25s",
    selectors: {
      "&[data-fold='true']": {
        flexDirection: "row",
        justifyContent: "space-between",
      },
    },
  },
]);
const fieldTitleBox = style({
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  gridTemplateAreas: "'overlap'",
});
const fieldTitle = style({
  gridArea: "overlap",
  textAlign: "left",
  transition: "all 0.25s",
  selectors: {
    "&[data-visible='true']": { opacity: 1 },
    "&[data-visible='false']": { opacity: 0, padding: 0 },
  },
});
const fieldDetailTitle = style({ padding: "32px 0 10px" });
const fieldValue = style([
  fonts.body3.regular,
  flexs(),
  {
    height: "32px",
    color: theme.color.primary["500"],
    transition: "opacity 0.25s",
    selectors: {
      "&[data-hide='true']": {
        opacity: 0,
      },
    },
  },
]);

const pepperItems = style([
  flexs({ justify: "spb", flex: 2 }),
  {
    width: "100%",
    color: theme.color.primary["600"],
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
]);
const spicyLabel = style([
  fonts.body4.medium,
  {
    flex: 1,
    color: theme.color.gray["500"],
    marginBottom: "10px",
  },
]);
const pepperItem = style([
  fonts.body1.medium,
  {
    display: "flex",
    margin: "0 auto",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    borderRadius: "50%",
    border: `1px solid ${theme.color.primary["200"]}`,
    color: theme.color.primary["400"],
    selectors: {
      "&:has(input:checked)": {
        color: theme.color.white,
        backgroundColor: theme.color.primary["500"],
        borderColor: "transparent",
      },
    },
  },
]);
globalStyle(`${pepperItem} > input[type="radio"]`, {
  display: "none",
});

const selectListGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "8px",
});

const spicyChangeLabel = style([
  fonts.body3.medium,
  {
    userSelect: "none",
    cursor: "pointer",
    display: "flex",
    width: "max-content",
    margin: "0 auto",
    gap: "6px",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: theme.color.gray["100"],
    color: theme.color.gray["600"],
    borderRadius: "8px",
    selectors: {
      "&:has(input:checked)": {
        backgroundColor: theme.color.primary["50"],
        color: theme.color.primary["600"],
      },
    },
  },
]);

export const formStyle = {
  formTitle,
  fieldTitleBox,
  fieldTitle,
  spicyLabel,
  fieldValue,
  fieldDetailTitle,
  spicyChangeLabel,
  fieldContainer,
  selectListGrid,
  pepperItems,
  pepperItem,
};
