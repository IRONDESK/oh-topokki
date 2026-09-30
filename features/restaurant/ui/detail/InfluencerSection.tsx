import Image from "next/image";
import Icons from "@/shared/ui/Icons";
import { youtubeThumbnailUrl, youtubeWatchUrl } from "@/shared/lib/youtube";

type Props = {
  videoIds: string[];
};

// 현재 등록된 소개 영상은 모두 떡볶퀸 채널
const CHANNEL_NAME = "떡볶퀸";

const THUMB_CLS =
  "group relative block aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-100";
const PLAY_CLS =
  "absolute inset-0 m-auto flex items-center justify-center size-8 rounded-full bg-red-600/90 text-white transition-transform group-hover:scale-110";

/** 유튜브에 소개된 영상 썸네일 목록 (한 줄에 2개, 넘치면 가로 스크롤) */
export default function InfluencerSection({ videoIds }: Props) {
  return (
    <section className="py-6 flex flex-col gap-4">
      <h3 className="px-5 text-lg font-semibold text-gray-900">
        인플루언서 소개
        <span className="ml-1 font-normal text-gray-500">{videoIds.length}</span>
      </h3>
      <ul className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 scroll-px-5">
        {videoIds.map((id) => (
          <li
            key={id}
            // 간격(gap-3 = 12px)을 뺀 나머지를 2등분 → 시트 폭의 약 1/2
            className="shrink-0 w-[calc((100%-12px)/2)] snap-start flex flex-col gap-1.5"
          >
            <a
              href={youtubeWatchUrl(id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${CHANNEL_NAME} 유튜브 소개 영상 보기`}
              className={THUMB_CLS}
            >
              <Image
                src={youtubeThumbnailUrl(id)}
                alt=""
                fill
                sizes="(max-width: 520px) 50vw, 240px"
                className="object-cover"
              />
              <span className={PLAY_CLS}>
                <Icons name="play" w="solid" size={14} />
              </span>
            </a>
            <p className="px-0.5 text-sm text-gray-600">
              {CHANNEL_NAME}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
