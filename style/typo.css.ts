import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { theme } from "@/style/theme.css";

export const fontSize = {
  head1: { fontSize: "6.4rem", lineHeight: "8rem" },
  head2: { fontSize: "5.6rem", lineHeight: "7.2rem" },
  head3: { fontSize: "4.8rem", lineHeight: "6.4rem" },
  head4: { fontSize: "4rem", lineHeight: "5.6rem" },
  head5: { fontSize: "3.2rem", lineHeight: "4rem" },
  head6: { fontSize: "2.4rem", lineHeight: "3.2rem" },
  body1: { fontSize: "2rem", lineHeight: "3rem" },
  body2: { fontSize: "1.8rem", lineHeight: "2.8rem" },
  body3: { fontSize: "1.6rem", lineHeight: "2.4rem" },
  body4: { fontSize: "1.4rem", lineHeight: "2rem" },
  caption1: { fontSize: "1.2rem", lineHeight: "1.8rem" },
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

type FontSizeKey = keyof typeof fontSize;
type FontWeightKey = keyof typeof fontWeight;

function buildFontVariants() {
  const variants: Record<
    FontSizeKey,
    Record<FontWeightKey, string>
  > = {} as never;

  (Object.keys(fontSize) as FontSizeKey[]).forEach((sizeKey) => {
    variants[sizeKey] = styleVariants(
      Object.fromEntries(
        (Object.keys(fontWeight) as FontWeightKey[]).map((weightKey) => [
          weightKey,
          {
            ...fontSize[sizeKey],
            fontWeight: fontWeight[weightKey],
          },
        ]),
      ),
    );
  });

  return variants;
}

export const fonts = buildFontVariants();
export const align = styleVariants({
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
});

const COLORS = [
  "gray",
  "success",
  "info",
  "warning",
  "red",
  "purple",
  "magenta",
  "primary",
] as const;
const COLOR_TYPES = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50];

export const typo = recipe({
  variants: {
    size: fontSize,
    weight: {
      regular: { fontWeight: "400" },
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
    },
    color: {
      white: { color: theme.color.white },
      black: { color: theme.color.black },
      ...(Object.fromEntries(
        COLORS.map((color) => {
          return COLOR_TYPES.map((type) => [
            `${color}${type}`,
            { color: (theme.color as any)[color][type] },
          ]);
        }).flat(),
      ) as Record<
        `${(typeof COLORS)[number]}${keyof typeof theme.color.primary}`,
        { color: string }
      >),
    },
  },
});
