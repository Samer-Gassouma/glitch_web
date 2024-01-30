"use client"

import {  User } from '@supabase/supabase-js'
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'
import { supabase } from '@/utils/supabase/client'

const Home: NextPage = () => {
  const [user, setUser] = useState<User | null>(null)

  const [oneSignalInitialized, setOneSignalInitialized] =
    useState<boolean>(false)

  useEffect(() => {
  
    (OneSignal as any).push(function () {
      OneSignal.init({
        appId: "d6da9c8a-e265-42b6-a90d-76f6bdad0290",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []); 

  

 
  return (
    <>
      <Head>
        <title>OneSignal Order Notification App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-black">
        {user ? (
          <form className="flex flex-col space-y-2" >
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block p-2"
              name="price"
            >
              <option value="100">$100</option>
              <option value="200">$200</option>
              <option value="300">$300</option>
            </select>
            <button
              type="submit"
              className="py-1 px-4 text-lg bg-green-400 rounded"
            >
              Place an Order
            </button>
          </form>
        ) : (
          <form className="flex flex-col space-y-2" >
            <input
              className="border-green-300 border rounded p-2 bg-transparent text-white"
              type="email"
              name="email"
              placeholder="Email"
            />
            <button
              type="submit"
              className="py-1 px-4 text-lg bg-green-400 rounded"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </main>
    </>
  )
}

export default Home