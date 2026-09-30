import Image from "next/image";
import Icons from "@/shared/ui/Icons";
import { youtubeThumbnailUrl, youtubeWatchUrl } from "@/shared/lib/youtube";

type Props = {
  videoIds: string[];
};

const THUMB_CLS =
  "group relative block aspect-video overflow-hidden rounded-card border-[1.5px] border-ink bg-gray-100 shadow-sticker-sm";
const PLAY_CLS =
  "absolute inset-0 m-auto flex items-center justify-center size-11 rounded-full bg-red-600/90 text-white transition-transform group-hover:scale-110";

/** 유튜브에 소개된 영상 썸네일 목록 */
export default function InfluencerSection({ videoIds }: Props) {
  const isSingle = videoIds.length === 1;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="px-5 text-xl font-semibold">
        인플루언서 소개
        <span className="ml-1.5 text-sm font-medium text-gray-400">
          {videoIds.length}
        </span>
      </h3>
      <ul className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2 scroll-px-5">
        {videoIds.map((id) => (
          <li
            key={id}
            className={
              isSingle ? "w-full" : "shrink-0 w-[min(72%,260px)] snap-start"
            }
          >
            <a
              href={youtubeWatchUrl(id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="유튜브에서 소개 영상 보기"
              className={THUMB_CLS}
            >
              <Image
                src={youtubeThumbnailUrl(id)}
                alt=""
                fill
                sizes="(max-width: 520px) 72vw, 260px"
                className="object-cover"
              />
              <span className={PLAY_CLS}>
                <Icons name="play" w="solid" size={18} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
