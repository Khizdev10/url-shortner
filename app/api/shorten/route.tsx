import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
  const { longUrl, alias } = await req.json();
  let abbreviation;
  if(alias){
    abbreviation = await checkIfAliasExist(alias);
    if(abbreviation === 'exist'){
      return NextResponse.json({error: "Alias already exists"});
    }
  }
  else{
    abbreviation = await hash();
  }

  async function  hash(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let alias = '';
  for(let i=0;i<6; i++){
    alias += chars.charAt(Math.floor(Math.random()* chars.length));
  }
  let aliasExist = await checkIfAliasExist(alias);
  if(aliasExist){
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

if(aliasExist){
    console.log("AAAAAAAAAAAAAAAAAAAG maaa ka bhosda aaaaaaaaaaaag")
  return 'exist'
}
return alias;
}

let shortenedUrl = "http://localhost:3000/" + abbreviation;

  const shorturl = await prisma.shortener.create({
    data: {
      longUrl,
      alias: abbreviation,
      shortUrl: shortenedUrl,
    },
  });

  return NextResponse.json(shorturl);
}
catch(error){
    console.log(error);
    return NextResponse.json({error: "Something went wrong"});
}
}