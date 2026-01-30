export const runtime = "nodejs";


import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

console.log("ddf")
export async function GET(
  req: Request,
  ctx: { params: Promise<{ alias: string }> }
) {
  const { alias } = await ctx.params;

  const shortenedUrl = await prisma.shortener.findUnique({
    where: { alias },
  });

  if (!shortenedUrl) {
    return new Response("Not found", { status: 404 });
  }

  redirect(shortenedUrl.longUrl);
}
