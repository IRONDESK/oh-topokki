const VIDEO_ID = /^[\w-]{11}$/;

/** 영상 ID 또는 각종 유튜브 URL(watch/youtu.be/shorts/embed)에서 11자리 ID를 뽑는다. */
export function toYoutubeId(value: string): string | null {
  const raw = value.trim();
  if (VIDEO_ID.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const id = url.hostname.endsWith("youtu.be")
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ??
        url.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1]);
    return id && VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const youtubeWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

// mqdefault(320x180)는 모든 영상에 항상 존재하는 16:9 썸네일
export const youtubeThumbnailUrl = (id: string) =>
  `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

/** recommend 목록에서 유튜브 영상 ID만 중복 없이 추출 */
export const getYoutubeIds = (recommend: { type: string; url: string }[]) => [
  ...new Set(
    recommend
      .filter((r) => r.type === "youtube")
      .map((r) => toYoutubeId(r.url))
      .filter((id): id is string => !!id),
  ),
];
