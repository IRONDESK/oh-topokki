import { overlay as overlayKit } from "overlay-kit";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { dialog } from "@/share/components/feature/dialog";

import { postAddFavorite } from "@/service/restaurant";
import LoginModal from "@/components/login/LoginModal";

export function useFavorite() {
  const { user } = useAuth();
  const { mutate: mutateAddFav } = useMutation({
    mutationFn: postAddFavorite,
  });

  const handleFavorite = (restaurantId: string): Promise<HandleFavoriteType> =>
    new Promise(async (resolve, reject) => {
      if (!user) {
        await handleLogoutFavorite();
        return;
      }

      mutateAddFav(
        { restaurantId, memo: "" },
        {
          onSuccess: (response) => {
            if (response.favorite) {
              toast.success("즐겨찾기에 추가했어요");
              resolve({ isFavorite: true, isSuccess: true });
            } else {
              toast.success("즐겨찾기를 해제했어요");
              resolve({ isFavorite: false, isSuccess: true });
            }
          },
          onError: (error) => {
            reject({
              isFavorite: null,
              isSuccess: false,
              message: error.message,
            });
          },
        },
      );
    });

  return { handleFavorite };
}

type HandleFavoriteType = {
  isFavorite: boolean | null;
  isSuccess: boolean;
  message?: string;
};

const handleLogoutFavorite = async () => {
  const confirm = await dialog.confirm({
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
