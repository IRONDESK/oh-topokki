// 사용하는 flaticon uicons 아이콘만 뽑아 서브셋 폰트 + CSS를 생성한다.
// (패키지 all.css는 1.2MB + 스타일별 폰트 250~400KB라 초기 번들을 크게 잡아먹음)
//
// 새 아이콘을 쓰려면 아래 ICONS에 추가한 뒤 실행:
//   pip install fonttools brotli   # 최초 1회 (pyftsubset 제공)
//   node scripts/build-icons.mjs
// 산출물(shared/style/icons/*, shared/ui/icon-names.ts)은 커밋한다.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// prefix: <weight 첫 글자><shape 첫 글자> — Icons.tsx의 `fi-${w[0]}${t[0]}-${name}` 규칙과 동일
const ICONS = {
  br: [
    "cross",
    "drawer-empty",
    "menu-dots",
    "refresh",
    "search",
    "settings-sliders",
    "star",
  ],
  rr: [
    "angle-small-down",
    "angle-small-right",
    "pepper",
    "refresh",
    "share",
    "square",
    "star",
    "tags",
  ],
  rs: ["cross"],
  sr: [
    "add",
    "arrow-circle-up",
    "checkbox",
    "map",
    "pepper",
    "pepper-hot",
    "play",
    "star",
    "triangle-warning",
  ],
  ss: ["social-network"],
};

const STYLE = {
  b: "bold",
  r: "regular",
  s: "solid",
};
const SHAPE = { r: "rounded", s: "straight" };

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const pkgCssDir = path.join(
  path.dirname(require.resolve("@flaticon/flaticon-uicons/package.json")),
  "css",
);
const outDir = path.join(root, "shared/style/icons");
const pyftsubset = process.env.PYFTSUBSET ?? "pyftsubset";

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let css = "/* 자동 생성 파일 — scripts/build-icons.mjs 로 재생성 */\n";

for (const [prefix, names] of Object.entries(ICONS)) {
  const family = `uicons-${STYLE[prefix[0]]}-${SHAPE[prefix[1]]}`;
  const srcCss = readFileSync(
    path.join(pkgCssDir, STYLE[prefix[0]], `${SHAPE[prefix[1]]}.css`),
    "utf8",
  );
  const fontFile = srcCss.match(
    new RegExp(`url\\(\\.\\./(${family}-[A-Z0-9]+\\.woff2)\\)`),
  )?.[1];
  if (!fontFile) throw new Error(`${family} woff2를 찾을 수 없음`);

  const rules = names.map((name) => {
    const code = srcCss.match(
      new RegExp(`\\.fi-${prefix}-${name}:before\\{content:"\\\\([0-9a-f]+)"\\}`),
    )?.[1];
    if (!code) throw new Error(`fi-${prefix}-${name} 아이콘이 없음`);
    return { name, code };
  });

  const outFont = `${family}.woff2`;
  execFileSync(pyftsubset, [
    path.join(pkgCssDir, fontFile),
    `--unicodes=${rules.map((r) => `U+${r.code}`).join(",")}`,
    "--flavor=woff2",
    "--no-hinting",
    `--output-file=${path.join(outDir, outFont)}`,
  ]);

  css += `@font-face{font-family:${family};src:url(./${outFont}) format("woff2");font-display:block}\n`;
  css += `[class^=fi-${prefix}-]:before,[class*=" fi-${prefix}-"]:before{font-family:${family}!important;font-style:normal;font-weight:400!important;font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\n`;
  for (const { name, code } of rules) {
    css += `.fi-${prefix}-${name}:before{content:"\\${code}"}\n`;
  }
}

writeFileSync(path.join(outDir, "uicons.css"), css);

const allNames = [...new Set(Object.values(ICONS).flat())].sort();
writeFileSync(
  path.join(root, "shared/ui/icon-names.ts"),
  `// 자동 생성 파일 — scripts/build-icons.mjs 로 재생성\nexport type IconName =\n${allNames
    .map((n) => `  | "${n}"`)
    .join("\n")};\n`,
);

console.log(`생성 완료: ${allNames.length}개 아이콘 → ${path.relative(root, outDir)}`);
