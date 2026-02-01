'use client'
import { redirect } from 'next/navigation';
import Login from './login/page';
import { useUser } from "@/context/UserContext";
import Website from './Website';

export default function Home(session: any) {
  // const [user,setUser] = useState();
  //  const { user } = useUser(); 
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




  const handleShorten = async () => {
    const longUrl = document.getElementById("longUrl") as HTMLInputElement;
    let shortenBtn = document.getElementById("shortenBtn") as HTMLButtonElement;
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
    if (data.error) {
      let aliasexistmsg = document.getElementById("aliasexistmsg") as HTMLInputElement;
      aliasexistmsg.classList.remove("hidden");
      // alert(data.error);
    }
    else {
      let aliasexistmsg = document.getElementById("aliasexistmsg") as HTMLInputElement;
      aliasexistmsg.classList.add("hidden");
      let shortenedUrlBox = document.getElementById("shortenedUrlBox") as HTMLInputElement;
      shortenedUrlBox.classList.remove("hidden");
      let shorturltext = document.getElementById("shorturltext") as HTMLAnchorElement;
      shorturltext.innerText = `${data.shortUrl}`;
      shortenBtn.innerText = "Shorten";
      shortenBtn.disabled = false;
      shorturltext.href = `${data.shortUrl}`;
      console.log("data:", data);
    }
  }



  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Website user={useUser} />
    </div>
  );
}