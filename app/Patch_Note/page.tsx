"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase/client";

export default function DownloadApp() {

  interface AppData {
    id: number;
    version: string;
    patchNotes: string;
    url: string;
    created_at: string;
  }

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState([] as any);

  useEffect(() => {
    async function fetchAppData() {
      try {
        const { data: appData, error } = await supabase
          .from('app')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          throw error;
        }
        setAppData(appData);
      } catch (error) {
        console.error('Error fetching app data:', (error as Error).message);
      } finally {
        setLoading(false);
      }
      
    }
    fetchAppData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <div className="p-8 shadow-lg rounded-lg bg-black max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Download App</h1>
        {loading ? (
          <span className="loading loading-bars loading-md"></span>
        ) : (
          <>
            <ul className="space-y-4">
            {appData.map((app: AppData) => (
                <li key={app.id} className="border p-4 rounded shadow">
                  <p className="mb-2"><span className="font-bold">Version:</span> {app.version} <span className='
                  text-sm text-gray-400 font-normal'>  released on : {' '}
                     {new Date(app.created_at).toLocaleDateString()}</span>   </p> 
                  <p className="mb-4"><span className="font-bold">Patch Notes:</span> {app.patchNotes}</p>
                  <a href={app.url} 
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200 ease-in-out">
                    Download
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center">Download the latest version of the app for Android.
              <span className="text-red-500"> (iOS coming soon)</span>
            </p>
            <p className="mt-4 text-sm text-gray-400">Note: You may need to enable <span className="font-bold">"Install unknown apps"</span> in your phone settings to install the app.</p>
          </>
        )}
      </div>
    </div>
  );
}