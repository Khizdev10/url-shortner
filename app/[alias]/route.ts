export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  // Record the click — wrapped so a DB failure never blocks the redirect
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") ?? "unknown";
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const referer = req.headers.get("referer") ?? undefined;

    await prisma.click.create({
      data: {
        shortenerId: shortenedUrl.id,
        ip,
        userAgent,
        referer,
      },
    });

    console.log(`[click] alias=${alias} ip=${ip}`);
  } catch (err) {
    console.error("[click] Failed to record:", err);
  }

  return NextResponse.redirect(shortenedUrl.longUrl, { status: 302 });
}
