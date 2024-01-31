"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signIn = async (props :any) => {
  "use server";
  console.log(props);
  const phone = props;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    console.error(error);
    return redirect("/login?message=Could not authenticate user");
  }
  
  return redirect("/login?message=Check your phone for the OTP");
};

export const verifyOTP = async (prop :any) => {
  "use server";

    const { phone, token } = prop.query;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    console.error(error);
    return redirect("/sms-login?message=Could not authenticate user");
  }

  return redirect("/");
};