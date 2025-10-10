interface PlaceFieldItem {
  label: string;
  value: string;
  description: string | null;
  icon: string | null;
}

export interface PlaceField {
  title: string;
  detailTitle: string;
  name: string;
  type:
    | "radio"
    | "number"
    | "text"
    | "checkbox"
    | "spicy-range"
    | "text-group"
    | "textarea";
  items?: PlaceFieldItem[] | null;
  placeholder?: string | null;
  number?: number;
  subField?: Partial<Omit<PlaceField, "subField">>;
}

export const placeFields: PlaceField[] = [
  {
    title: "떡볶이 종류",
    detailTitle: "어떤 떡볶이를 파는 곳인가요?",
    name: "topokkiType",
    type: "radio",
    items: [
      {
        label: "즉석떡볶이",
        value: "ontable",
        description: null,
        icon: null,
      },
      { label: "판떡볶이", value: "pan", description: null, icon: null },
      { label: "국물떡볶이", value: "soup", description: null, icon: null },
    ],
  },
  {
    title: "가격",
    detailTitle: "가격은 얼마인가요?",
    name: "price",
    type: "number",
    items: null,
    placeholder: "1인분 기준으로 알려주세요",
  },
  {
    title: "떡 종류",
    detailTitle: "무슨 떡을 쓰는 곳인가요?",
    name: "riceKinds",
    type: "checkbox",
    items: [
      {
        label: "밀떡",
        value: "flour",
        description: null,
        icon: null,
      },
      { label: "쌀떡", value: "rice", description: null, icon: null },
      { label: "가래떡", value: "longrice", description: null, icon: null },
    ],
  },
  {
    title: "맛(소스)",
    detailTitle: "어떤 맛 떡볶이가 있나요?",
    name: "sauceKinds",
    type: "checkbox",
    items: [
      {
        label: "기본(고추장/가루)",
        value: "gochu",
        description: null,
        icon: null,
      },
      { label: "로제", value: "rose", description: null, icon: null },
      { label: "짜장", value: "jjajang", description: null, icon: null },
      { label: "간장", value: "soy", description: null, icon: null },
      { label: "기름", value: "oil", description: null, icon: null },
    ],
  },
  {
    name: "spiciness",
    title: "맵기",
    detailTitle: "기본맛 기준으로 어느 정도 맵기인가요?",
    type: "spicy-range",
    items: null,
    subField: {
      name: "canChangeSpicy",
      type: "checkbox",
      title: "맵기 조절 가능",
      detailTitle: "맵기를 조절할 수 있어요",
    },
  },
  {
    title: "면 종류",
    detailTitle: "어떤 면을 넣을 수 있나요?",
    name: "noodleKinds",
    type: "checkbox",
    items: [
      { label: "라면", value: "ramyeon", description: null, icon: null },
      { label: "쫄면", value: "jjolmyeon", description: null, icon: null },
      { label: "우동면", value: "udon", description: null, icon: null },
      { label: "중국당면", value: "chinese", description: null, icon: null },
    ],
  },
  {
    title: "순대 종류",
    detailTitle: "순대는 어떻게 파는 곳인가요?",
    name: "sundaeType",
    type: "radio",
    items: [
      { label: "순대 없음", value: "", description: null, icon: null },
      { label: "순대만", value: "single", description: null, icon: null },
      {
        label: "기본 내장",
        value: "basic",
        description: "간, 허파 정도만",
        icon: null,
      },
      {
        label: "다양한 내장",
        value: "various",
        description: "거의 모든 내장",
        icon: null,
      },
    ],
  },
  {
    title: "사이드 메뉴",
    detailTitle: "어떤 사이드 메뉴가 있나요?",
    name: "sideMenus",
    type: "checkbox",
    items: [
      {
        label: "김밥",
        value: "kimbap",
        description: null,
        icon: null,
      },
      {
        label: "꼬마김밥",
        value: "smallkimbap",
        description: null,
        icon: null,
      },
      {
        label: "국물오뎅",
        value: "oden",
        description: null,
        icon: null,
      },
      {
        label: "삶은달걀",
        value: "egg",
        description: null,
        icon: null,
      },
      {
        label: "김말이튀김",
        value: "kimmari",
        description: null,
        icon: null,
      },
      {
        label: "오징어튀김",
        value: "squidfried",
        description: null,
        icon: null,
      },
      {
        label: "야채튀김",
        value: "vegetablefried",
        description: null,
        icon: null,
      },

      {
        label: "감자튀김",
        value: "potato",
        description: null,
        icon: null,
      },
      {
        label: "고구마튀김",
        value: "sweetpotato",
        description: null,
        icon: null,
      },
      {
        label: "야끼만두",
        value: "yakimandu",
        description: null,
        icon: null,
      },
      {
        label: "비엔나소시지",
        value: "sausage",
        description: null,
        icon: null,
      },
      {
        label: "치즈",
        value: "cheese",
        description: null,
        icon: null,
      },
    ],
  },
  {
    title: "기타",
    detailTitle: "이 가게만의 사이드 메뉴 혹은 특징이 있나요?",
    name: "others",
    type: "text-group",
    placeholder: "단어로 짧게 입력해 주세요",
  },
  {
    title: "나의 한줄평",
    detailTitle: "이 가게를 한 마디로 소개한다면?",
    name: "myComment",
    type: "textarea",
    number: 150,
    items: null,
    placeholder: "150자 이내로 작성할 수 있어요",
  },
];
