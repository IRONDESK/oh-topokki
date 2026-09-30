export const TOPOKKI_TYPE: Record<string, string> = {
  ontable: "즉석떡볶이",
  soup: "국물떡볶이",
  pan: "판떡볶이",
} as const;

export const RICE_TYPE: Record<string, string> = {
  longrice: "가래떡",
  flour: "밀떡",
  rice: "쌀떡",
} as const;

export const SUNDAE_TYPE: Record<string, string> = {
  single: "순대만 있어요",
  basic: "기본 내장",
  various: "다양한 내장",
} as const;

export const NOODLE_TYPE: Record<string, string> = {
  ramyeon: "라면",
  jjolmyeon: "쫄면",
  udon: "우동면",
  chinese: "중국당면",
} as const;

export const SAUCE_TYPE: Record<string, string> = {
  gochu: "기본(고추장/가루)",
  rose: "로제",
  jjajang: "짜장",
  soy: "간장",
  oil: "기름",
} as const;

export const SIDE_MENU_TYPE: Record<string, string> = {
  kimbap: "김밥",
  smallkimbap: "꼬마김밥",
  oden: "국물오뎅",
  egg: "삶은달걀",
  kimmari: "김말이튀김",
  squidfried: "오징어튀김",
  vegetablefried: "야채튀김",
  potato: "감자튀김",
  sweetpotato: "고구마튀김",
  yakimandu: "야끼만두",
  sausage: "비엔나소시지",
  cheese: "치즈",
} as const;

export const TOPOKKI_TYPE_ABBR: Record<string, string> = {
  ontable: "즉떡",
  pan: "판떡",
  soup: "국물",
} as const;

export const RATING_MESSAGE: Record<number, string> = {
  1: "아쉬워요",
  2: "평범해요",
  3: "근처라면 가볼만 해요",
  4: "시간내서 꼭 가보세요",
  5: "멀어도 꼭 가보세요",
} as const;
