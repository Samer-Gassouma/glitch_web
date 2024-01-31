
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import LatestCourses from "@/components/LatestCourses";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  const supabase = createClient(cookieStore);
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

 
 
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="overflow-y-hidden h-screen flex-1 bg-black">
     {!user ? 
        <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-4">Welcome to Glitch</h1>
          <p className="text-xl text-center">
            A place where you can learn and share your knowledge with others.
          </p>
      
          <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700">
            <p className="font-bold">Important Notice:</p>
            <p>All accounts have been deleted. Please create a new account to continue.
              Don't worry, this won't happen again.
              <br></br>
              (Don't forget to check your spam folder for the verification email)
            </p>
          </div>
      
          <span 
          className="text-xl text-center mt-4"
          >But you Need to{" "}
          <a
          href="/login"
          className="text-blue-500 hover:underline cursor-pointer font-bold"
          >Login</a> First </span>
      
          <p className="text-xl text-center mt-4 font-bold">
            WE ARE STILL IN BETA SO PLEASE REPORT ANY BUGS YOU FIND
          </p>
        </div>
      </div>
        :
        <LatestCourses />
      }
      </div>
      <footer className="w-full border-t border-t-foreground/10 p-6 flex justify-center text-center text-xs fixed bottom-0 bg-black z-10">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://twitter.com/SamerGassouma"
            target="_blank"
            className="font-bold hover:underline text-white"
            rel="noreferrer"
          >
            ivan
          </a>
        </p>
      </footer>
    </div>
  );
}
