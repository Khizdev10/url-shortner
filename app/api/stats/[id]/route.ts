import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await ctx.params;
        const linkId = parseInt(id, 10);

        if (isNaN(linkId)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        // Fetch link and verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const link = await prisma.shortener.findUnique({
            where: { id: linkId },
            include: {
                clicks: {
                    orderBy: { clickedAt: "desc" },
                },
            },
        });

        if (!link) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        if (link.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ link });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
