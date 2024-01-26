"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

const Edit = () => {
  const id = usePathname().replace("/Subjects/", "").split("/")[0];
  const [subjectName, setsubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetchSubjects();
  }, []);



  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*").eq("id", id);
      if (error) {
        console.error("Error fetching subjects:", error.message || error);
      } else {
        setsubjectName(data[0].Name);
      }
    }catch (error: any) {
      console.error("Error fetching subjects:", error.message || error);
      
    }finally {
      setLoading(false);
    }

  };


  const handleSave = async () => {
    try {
      if (!subjectName ) {
        alert("All fields are required");
        return;
      }
  
      const { data: updateData, error: updateError } = await supabase
        .from('subjects')
        .update({
          Name: subjectName,
        })
        .eq('id', id);
  
      if (updateError) {
        console.error("Error updating file details:", updateError.message || updateError);
        setMessage("Error updating file details");
      } else {
        setMessage("File details updated successfully!");
      }
    }catch (error: any) {
      console.error("Error updating file details:", error.message || error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen  py-2 px-4">
        <span className="loading loading-infinity loading-lg"></span>
    </div>
    );
;
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-900 py-2 px-4">
      {message.length > 0 && (
      <div role="alert" className="alert alert-info mb-5 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{message}</span>
        </div>
      )}
      <div className="max-w-md w-full space-y-8 bg-gray-700 p-8 rounded-md shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Edit Subject</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" value={subjectName} onChange={(e) => setsubjectName(e.target.value)} className="input input-bordered w-full max-w-xs" />

        </div>

        <div className="mt-6 justify-center flex">
        <button className="btn btn-outline btn-secondary" onClick={handleSave}>Upadte</button>

        </div>
      </div>
    </div>
  );
};

export default Edit;