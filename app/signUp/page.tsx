"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default async function signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }


  const signUp = async (formData: FormData) => {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const origin = window.location.origin;
    try{
    const { data,error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    }); 
    console.log(data.user)
    if (error) {
      return redirect("/signUp?message=Could not authenticate user error 551");
    }else{ 
      

      try{
          const { data:userData, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id : data.user?.id,
              email: data.user?.email,
              is_admin: false,
            },
          ]);

          if (insertError) {
            return redirect("/signUp?message=Could not authenticate user error 552");
          }else{        
            return redirect("/login?check your email to verify your account");
          }
        }catch(error){
          console.log(error)
          return redirect("/signUp?message=Could not authenticate user error 553");
        }

    }
   
    
  }catch(error){
    console.log(error)

    return redirect("/login?message=check your email to verify your account");
  }


  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signUp}
      >
      <h1 className="text-3xl font-bold mb-8 text-center">Create an account</h1>
      
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-blue-700 rounded-md px-4 py-2 text-foreground mb-2">
        Create
        </button>
        <p className="text-center">or</p>
        <p className="text-center">you already have an account?</p>
        <Link href="/login" className="text-center">
         <span className="font-bold" > Login </span>
        </Link>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
