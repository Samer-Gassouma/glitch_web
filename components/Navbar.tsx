import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import Link from "next/link";
import Image from "next/image";
import GlitchLogo from "../app/assets/logo-no-background.png";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let userAdmin = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if(user){
  const { data, error: fetchError } = await supabase
      .from("users")
      .select("id, email, is_admin")
      .eq("email", user?.email)
      .single();
    userAdmin = data?.is_admin;
  if (fetchError) {
    throw fetchError;
  }
}

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 fixed top-0 z-10">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm ">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src={GlitchLogo}
              alt="Logo"
              width={70}
              height={70}
            className="mr-2 
            text-foreground/50
            hover:text-foreground/100
            transition-colors
            duration-200
            ease-in-out
            cursor-pointer
            
            " />
            
          </div>
        </Link>
        {user && userAdmin == true && (
          <>
          <DeployButton Name='Admin' path='/Dark_Side'/>
        <DeployButton Name='Add Course' path='/Subjects/Add' userId={user.id}/>
        <DeployButton Name='Add Subject' path='/Subjects/AddSubject' userId={user.id}/>
     
        </>
        )}
        <AuthButton />
        <div className="flex items-center">
        <Link href="/Patch_Note">
          <div className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200 ease-in-out">
            Download APP
          </div>
        </Link>
  </div>
      </div>
    </nav>
  )
}