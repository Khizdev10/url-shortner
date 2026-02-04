import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Email and Password are required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({ data: { email, password: hashedPassword, name } });
        return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}