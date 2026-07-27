// 랜덤 닉네임 생성 — 회원가입 기본 닉네임과 익명 리뷰 닉네임에서 공용 사용
const NICKNAME_TTEOK = [
  "밀떡",
  "쌀떡",
  "즉석떡",
  "로제떡",
  "짜장떡",
  "궁중떡",
  "간장떡",
  "치즈떡",
  "매운떡",
  "마라떡",
];
const NICKNAME_VERBS = ["먹는", "만든", "찾는", "망친", "엎은", "끓이는"];
const NICKNAME_WHO = [
  "오리",
  "돼지",
  "하마",
  "여우",
  "냥이",
  "멍이",
  "소라",
  "너구리",
  "고등어",
  "문어",
  "호랑이",
  "토끼",
  "곰",
  "원숭이",
  "사자",
  "사장",
  "회장",
  "부장",
  "직원",
  "알바",
  "요리사",
  "개발자",
];

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

export const generateNickname = () =>
  `${pick(NICKNAME_TTEOK)}볶이${pick(NICKNAME_VERBS)}${pick(NICKNAME_WHO)}${Math.floor(Math.random() * 99) + 1}`;
