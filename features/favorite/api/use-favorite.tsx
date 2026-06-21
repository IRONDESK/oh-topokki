import { overlay as overlayKit } from "overlay-kit";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFavorites, postAddFavorite } from "@/shared/api/restaurant";
import { useAuth } from "@/shared/context/AuthContext";
import { dialog } from "@/shared/ui/feature/dialog";
import { restaurantKeys } from "@/features/restaurant/api/use-restaurant";
import LoginModal from "@/features/auth/ui/LoginModal";

export const favoriteKeys = {
  all: ["favorite"] as const,
  lists: () => [...favoriteKeys.all, "list"] as const,
};

export const useFavorites = () =>
  useQuery({
    queryKey: favoriteKeys.lists(),
    queryFn: getFavorites,
    staleTime: 30_000,
  });

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAddFavorite,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(variables.restaurantId),
      });
    },
  });
};

type HandleFavoriteResult = {
  isFavorite: boolean | null;
  isSuccess: boolean;
  message?: string;
};

export function useFavorite() {
  const { user } = useAuth();
  const { mutate: mutateToggle } = useToggleFavorite();

  const handleFavorite = (
    restaurantId: string,
  ): Promise<HandleFavoriteResult> =>
    new Promise((resolve, reject) => {
      if (!user) {
        void handleLogoutFavorite();
        return;
      }

      mutateToggle(
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
