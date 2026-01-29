'use client'
import Navbar from '../components/Navbar'
import Mainpage from '../components/Mainpage'
import Info from '../components/Info'
import { HowItWorks } from '../components/Working'
import { useState } from 'react';

export default function Home() {
  const [user,setUser] = useState();
 
  const handleShorten = async()=>{
 const longUrl = document.getElementById("longUrl") as HTMLInputElement;
 console.log(longUrl.value);
 const longUrlValue = longUrl.value;
 const alias = document.getElementById("alias") as HTMLInputElement;
 const aliasValue = alias.value;
 console.log(aliasValue);

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
  console.log("data is fuck me daddy",data);
}
  }
 
  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <Mainpage handleShorten={handleShorten}/>
      <Info />
      <HowItWorks />
    </div>
  );
}