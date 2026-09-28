import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "ok",
    database: await databaseStatus(),
  });
}

async function databaseStatus(): Promise<"ok" | "unavailable"> {
  if (!process.env.DATABASE_URL) {
    return "unavailable";
  }

  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return "ok";
  } catch {
    return "unavailable";
  }
}
