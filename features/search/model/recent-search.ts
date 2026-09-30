const STORAGE_KEY = "recent-searches";
const MAX_COUNT = 8;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage 접근 불가(사파리 시크릿 등)면 조용히 무시
  }
}

export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const next = [
    trimmed,
    ...getRecentSearches().filter((v) => v !== trimmed),
  ].slice(0, MAX_COUNT);
  save(next);
  return next;
}

export function removeRecentSearch(term: string): string[] {
  const next = getRecentSearches().filter((v) => v !== term);
  save(next);
  return next;
}

export function clearRecentSearches(): string[] {
  save([]);
  return [];
}
