"use client"
import { redirect,usePathname } from "next/navigation";
export default function CheckAccess() {
    const router = usePathname();
  if (router !== '/login' && router !== '/signin' && router !== '/') {
    redirect('/login');
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-bold mb-4">Welcome to Glitch</h1>
        <p className="text-xl text-center">
          A place where you can learn and share your knowledge with others.
        </p>
        
        <p className="text-xl text-center">
          Start by adding a subject, a folder or a course.
        </p>
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
  )
}