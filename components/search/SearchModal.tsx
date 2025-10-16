import ScrolledBottomSheet from "@/share/components/ScrolledBottomSheet";
import { ComponentProps } from "react";
import type { OverlayControllerComponent } from "overlay-kit";
import { searchStyle } from "@/components/search/search.css";
import { flexRatio, flexs } from "@/style/container.css";
import { typo } from "@/style/typo.css";

type Props = {
  controller: ComponentProps<OverlayControllerComponent>;
};
function SearchModal({ controller }: Props) {
  return (
    <ScrolledBottomSheet controller={controller}>
      {({ isFull, isSticky }) => (
        <div className={searchStyle.container}>
          <div>
            <input type="text" placeholder="검색어를 입력해 주세요" />
          </div>
          <div className={flexs({ gap: "12", justify: "start" })}>
            <div className={searchStyle.resultPin}>1</div>
            <div className={flexRatio["1"]}>
              <p
                className={flexs({
                  justify: "spb",
                  align: "center",
                })}
              >
                <span
                  className={typo({
                    size: "body3",
                    weight: "medium",
                    color: "gray700",
                  })}
                >
                  식당명
                </span>
                <span
                  className={typo({
                    size: "body4",
                    weight: "regular",
                    color: "gray600",
                  })}
                >
                  즉떡
                </span>
              </p>
              <p
                className={flexs({
                  justify: "spb",
                  align: "center",
                })}
              >
                <span
                  className={typo({
                    size: "caption1",
                    weight: "regular",
                    color: "gray500",
                  })}
                >
                  경기도 김포시
                </span>
                <span
                  className={typo({
                    size: "body4",
                    weight: "regular",
                    color: "gray500",
                  })}
                >
                  300m
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

export default SearchModal;
