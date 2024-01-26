"use client"
import React from 'react'
import { usePathname, useRouter,redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { saveAs } from 'file-saver';
import Link from 'next/link';

export default function ResourcePage() {


  const id  = usePathname().replace("/Subjects/", "").split("/")[1]
  const [Resource, setResource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');


  
  
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const { data, error } = await supabase
        .from("Resources")
        .select("*")
        .eq("ResourceID", id)
        .single();
        setResource(data);


        if (error) {
          throw error;
        }
      } catch (error) {
        setError(true);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    if(id)
      fetchSubject();


  }, []);
 if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen  py-2 px-4">
        <span className="loading loading-infinity loading-lg"></span>
    </div>
    );
;
  }

  if (error) {
    return <p>{message}</p>;
  }

  if (!Resource) {
    return <p>Subject not found</p>;
  }


  const handleRead = () => {
    window.open(Resource.URL2, '_blank');
  };
  
  const handleDownload = () => {
    saveAs(Resource.URL2, Resource.ResourceName);
  };
 

  const handleDelete = async () => {
    try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Resources")
          .delete()
          .match({ ResourceID: Resource.ResourceID });
        if (error) {
          throw error;
        }
        alert("Resource deleted successfully");
      } catch (error) {
        console.error("Error deleting file:", error.message || error);
      }
      finally {
        setLoading(false);
      } 
    };
  return (
    <div className='bg-gray-900 h-screen w-screen flex items-center justify-center'>
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="max-w-xs transform transition duration-500 hover:scale-105">
          <div className="bg-gray-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2 text-blue-400 animate-pulse">{Resource.ResourceName}</h1>
              <p className="text-gray-400 text-sm">Uploaded on:  {new Date(Resource.created_at).toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
              <button onClick={handleRead} className="w-full px-4 py-2 text-sm font-medium text-black bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-600 transition duration-200">Read</button>
            </div>
            {Resource.VisibilityMode == 'Download' && (
            <div className="mb-4">
              <button onClick={handleDownload} className="w-full px-4 py-2 text-sm font-medium text-black bg-green-400 rounded hover:bg-green-500 focus:outline-none focus:bg-green-600 transition duration-200">Download</button>
            </div>
            )}
            <Link href={`/Subjects/${Resource.SubjectID}/${Resource.ResourceID}/edit`}>
            <div className="mb-4">
              <button  className="w-full px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded hover:bg-yellow-500 focus:outline-none focus:bg-yellow-600 transition duration-200">Edit</button>
            </div>
            </Link>
            <div className="mb-4">
              <button onClick={handleDelete} className="w-full px-4 py-2 text-sm font-medium text-black bg-red-400 rounded hover:bg-red-500 focus:outline-none focus:bg-red-600 transition duration-200">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}