'use client'
import Navbar from '../components/Navbar'
import Mainpage from '../components/Mainpage'
import Info from '../components/Info'
import { HowItWorks } from '../components/Working'
import { useState } from 'react';

export default function Home() {
  const [user,setUser] = useState();
  const handleShorten = ()=>{
    if(user){
      alert("shortening the url");
    }
    else{
      alert("Please Login first");
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
