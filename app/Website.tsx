'use client'
import Navbar from '../components/Navbar'
import Mainpage from '../components/Mainpage'
import Info from '../components/Info'
import { HowItWorks } from '../components/Working'
import { useState, useEffect } from 'react';
// import { redirect } from 'next/navigation';
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";


export default function Website(session: any) {
  // const [user,setUser] = useState();
 const { user } =  useUser(); 
const router = useRouter();
const { status } = useSession();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return null;
  const copy = () => {
    const shorturltext = document.getElementById("shorturltext") as HTMLAnchorElement;
    const url = shorturltext.href;
  
    const textarea = document.createElement("textarea");
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  
    const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
    copyBtn.innerText = "Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  };
  
  
  

  const handleShorten = async()=>{
 const longUrl = document.getElementById("longUrl") as HTMLInputElement;
 let shortenBtn  = document.getElementById("shortenBtn") as HTMLButtonElement;
 shortenBtn.innerText = "Generating...";
 shortenBtn.disabled = true;
 const longUrlValue = longUrl.value;
 const alias = document.getElementById("alias") as HTMLInputElement;
 const aliasValue = alias.value;

 const response = await fetch("/api/shorten", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ longUrl: longUrlValue, alias: aliasValue }),
});

const data = await response.json();
if(data.error){
  let aliasexistmsg = document.getElementById("aliasexistmsg") as HTMLInputElement;
  aliasexistmsg.classList.remove("hidden");
  // alert(data.error);
}
else{
  let aliasexistmsg = document.getElementById("aliasexistmsg") as HTMLInputElement;
  aliasexistmsg.classList.add("hidden");
  let shortenedUrlBox = document.getElementById("shortenedUrlBox") as HTMLInputElement;
  shortenedUrlBox.classList.remove("hidden");
  let shorturltext = document.getElementById("shorturltext") as HTMLAnchorElement;
  shorturltext.innerText = `${data.shortUrl}`;
  shortenBtn.innerText = "Shorten";
 shortenBtn.disabled = false;
  shorturltext.href = `${data.shortUrl}`;
  console.log("data:",data);
}
  }
 
  const checkLoggedIn = async () => {
    if(status == 'authenticated'){
     alert("User logged In") 
     router.push("/dashboard");
    }
    else{
        console.log("User not logged In:",user) 
      // alert("User not logged In") 
      router.push("/login")
    }
  }

  
  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
  
      <Navbar checkLoggedIn={checkLoggedIn}/>
      <Mainpage handleShorten={handleShorten} copy={copy} user={user}/>
      {/* <Login /> */}
      <Info />
      <HowItWorks />
    </div>
  );
}