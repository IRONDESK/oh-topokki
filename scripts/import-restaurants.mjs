// JSON 파일의 식당 목록을 DB에 일괄 등록하는 일회성 스크립트.
// 실행: node --env-file=.env scripts/import-restaurants.mjs <json파일경로>
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const filePath = process.argv[2];
if (!filePath) {
  console.error("사용법: node --env-file=.env scripts/import-restaurants.mjs <json파일경로>");
  process.exit(1);
}

const prisma = new PrismaClient();
const raw = JSON.parse(readFileSync(filePath, "utf-8"));

const rows = raw.map((r) => ({
  // 원본 id를 유지 → 재실행 시 skipDuplicates로 중복 삽입 방지
  id: r.id,
  name: r.name,
  address: r.address,
  latitude: r.latitude,
  longitude: r.longitude,
  phoneNumber: r.phoneNumber || null,
  authorId: r.authorId || null,
  // 빈 문자열은 유효한 enum 값이 아니므로 null로 정규화
  topokkiType: r.topokkiType || null,
  sundaeType: r.sundaeType || null,
  price: r.price ?? null,
  priceServings: r.priceServings ?? 1,
  riceTypes: r.riceTypes ?? [],
  sauceTypes: r.sauceTypes ?? [],
  spiciness: r.spiciness ?? null,
  canChangeSpicy: r.canChangeSpicy ?? false,
  sideMenus: r.sideMenus ?? [],
  noodleTypes: r.noodleTypes ?? [],
  others: r.others ?? [],
  recommend: r.recommend ?? [],
}));

const result = await prisma.restaurant.createMany({
  data: rows,
  skipDuplicates: true,
});

console.log(`입력 ${rows.length}건 중 ${result.count}건 등록 (${rows.length - result.count}건은 이미 존재하여 건너뜀)`);
await prisma.$disconnect();