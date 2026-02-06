'use client'
import Navbar from '../components/Navbar'
import Mainpage from '../components/Mainpage'
import Info from '../components/Info'
import { HowItWorks } from '../components/Working'
import { handleShorten, copy } from './utils/utils'

export default function Website(session: any) {


  // wo bhi apne naa hweee dil bhi gyaa haathon se
  // yup this is the thing 
  // const [user,setUser] = useState();




  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <Navbar />
      <Mainpage handleShorten={handleShorten} copy={copy} />
      {/* <Login /> */}
      <Info />
      <HowItWorks />
    </div>
  );
}