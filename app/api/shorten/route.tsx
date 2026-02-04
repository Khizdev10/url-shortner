export const runtime = "nodejs";

import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { longUrl, alias } = await req.json();
    let abbreviation;
    console.log("Value of alias Q@@@@@@@ ", alias)

    if (alias) {
      const aliasExists = await checkIfAliasExist(alias);

      if (aliasExists) {
        return NextResponse.json({ error: "Alias already exists" });
      }
      else {
        console.log("hello world")
        abbreviation = alias;
      }
    }
    else {
      abbreviation = await hash();
    }

    async function hash() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let alias = '';
      for (let i = 0; i < 6; i++) {
        alias += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      let aliasExist = await checkIfAliasExist(alias);
      if (aliasExist) {
        return await hash();
      }
      return alias;
    }


    async function checkIfAliasExist(alias: string) {
      const aliasExist = await prisma.shortener.findUnique({
        where: {
          alias: alias,
        },

      });

      if (aliasExist) {
        console.log("AAAAAAAAAAAAAAAAAAAG maaa ka bhosda aaaaaaaaaaaag")
        return true
      }
      return false;
    }

    let shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${abbreviation}`;

    const shorturl = await prisma.shortener.create({
      data: {
        longUrl,
        alias: abbreviation,
        shortUrl: shortenedUrl,
      },
    });

    return NextResponse.json(shorturl);
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}