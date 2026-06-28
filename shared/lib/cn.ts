import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 조건부 클래스 결합 + Tailwind 충돌 클래스 정리.
 * clsx로 합친 뒤 twMerge로 같은 속성의 유틸 충돌(예: border-ink vs border-gray-600)을
 * 뒤 값이 이기도록 해소합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
