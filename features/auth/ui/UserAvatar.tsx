/** 프로필 이미지가 없으면 닉네임 첫 글자를 보여주는 원형 아바타 */
export default function UserAvatar({
  image,
  nickname,
  size = 36,
}: {
  image?: string | null;
  nickname: string;
  size?: number;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={`${nickname} 프로필`}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover bg-gray-100"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="shrink-0 flex items-center justify-center rounded-full bg-primary-50 border border-primary-200 text-primary-600 font-semibold select-none"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {nickname.charAt(0)}
    </div>
  );
}
