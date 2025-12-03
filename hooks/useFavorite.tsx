import { overlay as overlayKit } from "overlay-kit";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { overlay } from "@/share/components/feature/overlay";

import { postAddFavorite } from "@/service/restaurant";
import LoginModal from "@/components/login/LoginModal";

export function useFavorite() {
  const { user } = useAuth();
  const { mutate: mutateAddFav } = useMutation({
    mutationFn: postAddFavorite,
  });

  const addFavorite = async (restaurantId: string) => {
    if (!user) {
      await addLocalStorage();
      return;
    }

    mutateAddFav(
      { restaurantId, memo: "" },
      {
        onSuccess: () => {
          console.log("complete!");
        },
      },
    );
  };

  return { addFavorite };
}

const addLocalStorage = async () => {
  const confirm = await overlay.confirm({
    title: "로그인을 하지 않았어요",
    contents:
      "즐겨찾기 추가는 로그인 후 이용할 수 있어요.\n로그인 과정을 진행할까요?",
    btnText: {
      confirm: "로그인 하기",
    },
  });

  if (confirm) {
    overlayKit.close("restaurant-detail");
    overlayKit.open((controller) => (
      <LoginModal message="로그인 후에 작성할 수 있어요" {...controller} />
    ));
  }
};
