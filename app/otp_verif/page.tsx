"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
export default function SMSLogin({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
    const [userData, setUserdata] = useState("");
    const [userId, setUserId] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            const {data: { user }} = await supabase.auth.getUser();
            setUserdata(user?.new_phone || '')
            setUserId(user?.id || '')
        }
    fetchUser()
    if(userData){
        redirect("/")
    }

    }, []);
    
  const handleOTP = async () => {
    
    
    if(!otpSent){
      const {data, error} = await supabase.auth.signInWithOtp({
        phone: phone
      })
      if(error){
        alert(error.message)
      }
      else{
        setOtpSent(true)
      }
    }
    else{
      const {data, error} = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      })
      if(error){
        alert(error.message)
      }
      else{

        
        const { data, error } = await supabase
          .from("users")
          .update({ phone: phone })
          .eq("id", userId);
        if (error) {
          alert(error.message);
        } 
        const { data:dataAuth, error:ErrorAuth } = await supabase.auth.updateUser({
            phone: phone,
          });
      
        if (ErrorAuth) {
        alert("ERROR 140 ,Try again later , Or contact admin")
        throw new Error("Failed to update phone number");
        }else{
            redirect("/")
        }
        

    }

    }
  };



  

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-xl justify-center gap-2">
    
      <h1 className="text-4xl font-bold">Sign in using phone number</h1>
      <p className="text-foreground">
        {searchParams.message || "Sign in to your account"}
      </p>
   
        <label htmlFor="phone" className="flex flex-col gap-1">
          <span className="text-foreground">Phone</span>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="rounded-md px-4 py-2 bg-inherit border mb-2"
            placeholder="+21612345678"
            required
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
        </label>

        {otpSent && (
        <label
        
        >
          <span className="text-foreground">Your OTP</span>
          <input
            type="text"
            name="token"
            id="token"
            required
            placeholder="123456"
            onChange={(e) => setToken(e.target.value)}
            value={token}
            className={`rounded-md px-4 py-2 bg-inherit border mb-2`}
          />
        </label>
      )}
        <button
          type="submit"
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 max-w-max hover:bg-green-600"
          onClick={handleOTP}
        >
          {otpSent ? "Verify OTP" : "Send OTP"}
        </button>
        {otpSent && <ExpirationTimer />}
   
    </div>
  );
}

const ExpirationTimer = () => {
  const expirationTime = 60;
  const [timeLeft, setTimeLeft] = useState(expirationTime);

  let id: any = null;

  useEffect(() => {
    if (timeLeft > 0) {
      id = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(id);
    };
  }, [timeLeft]);

  return (
    <div className="flex justify-between items-center">
      <p className="text-foreground text-sm">
        {timeLeft > 0 ? `OTP expires in ${timeLeft} seconds` : "OTP expired!"}
      </p>
      <button
        className="text-foreground text-sm underline disabled:text-foreground/50 disabled:cursor-not-allowed"
        disabled={timeLeft > 0}
      >
        Resend OTP
      </button>
    </div>
  );
};