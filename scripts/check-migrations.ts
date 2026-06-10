import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const migrations = await prisma.$queryRaw<
    Array<{
      migration_name: string;
      finished_at: Date | null;
      rolled_back_at: Date | null;
      logs: string | null;
    }>
  >`
    SELECT migration_name, finished_at, rolled_back_at, substring(logs from 1 for 400) as logs
    FROM _prisma_migrations
    ORDER BY started_at DESC
    LIMIT 8
  `;
  console.log("=== _prisma_migrations (recent) ===");
  for (const m of migrations) {
    console.log({
      name: m.migration_name,
      finished: Boolean(m.finished_at),
      rolledBack: Boolean(m.rolled_back_at),
      logs: m.logs?.slice(0, 200) ?? null,
    });
  }

  const tables = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'page_view_hits'
    ) as exists
  `;
  console.log("\npage_view_hits exists:", tables[0]?.exists);

  if (tables[0]?.exists) {
    const cols = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'page_view_hits'
      ORDER BY ordinal_position
    `;
    console.log("columns:", cols.map((c) => c.column_name).join(", "));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
