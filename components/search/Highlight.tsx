type Props = {
  text: string;
  keyword: string;
  highlightClassName: string;
};

export default function HighlightKeyword({
  text,
  keyword,
  highlightClassName,
}: Props) {
  if (!keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
