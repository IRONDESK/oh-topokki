import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import ScrolledBottomSheet, {
  closeSheet,
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";

const NOTICES = [
  "회원 정보(이메일·닉네임·비밀번호)와 즐겨찾기가 삭제되며 복구할 수 없어요.",
  "등록한 맛집과 작성한 리뷰·별점은 다른 이용자와 함께 쓰는 정보라 삭제되지 않고, '탈퇴한 사용자'로 표시되어 남아요.",
  "탈퇴 후에는 리뷰를 수정·삭제할 수 없으니, 지우고 싶은 리뷰가 있다면 탈퇴 전에 직접 삭제해 주세요.",
  "데이터 유실 대비용 백업본에는 최대 90일간 남아 있다가 자동으로 삭제돼요.",
];

/** 회원 탈퇴: 안내 확인 + 비밀번호 재확인 후 즉시 탈퇴 */
export default function WithdrawSheet({
  controller,
}: {
  controller: SheetController;
}) {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const withdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    const { error } = await authClient.deleteUser({ password });
    setLoading(false);

    if (error) {
      toast.error(
        error.code === "INVALID_PASSWORD"
          ? "비밀번호가 일치하지 않아요"
          : (error.message ?? "탈퇴에 실패했어요"),
      );
      return;
    }

    // 즐겨찾기·상세(isFavorite, 내 리뷰) 등 로그인 기준 캐시를 모두 다시 받는다
    await queryClient.invalidateQueries();
    toast.success("탈퇴가 완료됐어요. 그동안 이용해 주셔서 감사합니다.");
    closeSheet(controller);
  };

  return (
    <ScrolledBottomSheet controller={controller}>
      {() => (
        <form onSubmit={withdraw} className="px-5 pt-2 flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-ink">회원 탈퇴</h2>

          <ul className="flex flex-col gap-2 rounded-card bg-gray-50 border border-gray-200 p-4 text-sm leading-relaxed text-gray-600 break-keep [&>li]:pl-3 [&>li]:relative [&>li]:before:content-['•'] [&>li]:before:absolute [&>li]:before:left-0">
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-600">
              본인 확인을 위해 비밀번호를 입력해 주세요
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              autoComplete="current-password"
              className="w-full py-4 px-4 rounded-btn text-lg bg-gray-100 border-[1.5px] border-transparent outline-none focus:border-red-300 focus:bg-white"
            />
          </label>

          <button
            type="submit"
            disabled={!password || loading}
            className="cursor-pointer flex items-center justify-center gap-2 w-full h-[52px] rounded-btn border-[1.5px] border-red-300 bg-white text-lg font-medium text-red-600 active:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          >
            {loading && (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            )}
            탈퇴하기
          </button>
        </form>
      )}
    </ScrolledBottomSheet>
  );
}
