export function ArrowDownIcon({
  size,
  strokeWidth,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth || 2}
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-arrow-down preview-icon"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}
