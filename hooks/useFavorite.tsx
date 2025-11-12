import { overlay as overlayKit } from "overlay-kit";
import { useAuth } from "@/contexts/AuthContext";
import { overlay } from "@/share/components/feature/overlay";
import LoginModal from "@/components/login/LoginModal";

export function useFavorite() {
  const { user } = useAuth();
  const localFavList = JSON.parse(
    localStorage.getItem("favorite") || "[]",
  ) as string[];

  const addFavorite = async (restaurantId: string) => {
    if (!user) {
      await addLocalStorage(restaurantId);
    }
  };

  return { addFavorite };
}

const addLocalStorage = async (restaurantId: string) => {
  const confirm = await overlay.confirm({
    title: "로그인을 하지 않았어요",
    contents:
      "로그아웃 상태에서는 기기 직접 저장으로 최대 3개까지 즐겨찾기되며,\n다른 브라우저나 디바이스에서 즐겨찾기를 볼 수 없어요.",
    btnText: {
      confirm: "로그인 하기",
    },
  });

  if (confirm) {
    overlayKit.close("restaurant-detail");
    overlayKit.open((controller) => (
      <LoginModal message="로그인 후에 작성할 수 있어요" {...controller} />
    ));
  } else {
    localStorage.setItem("favorite", JSON.stringify(restaurantId));
    window.alert(`완료  ${restaurantId}`);
  }
};
