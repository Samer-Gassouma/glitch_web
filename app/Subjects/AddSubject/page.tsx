"use client"
import React, { useState, useEffect } from 'react';
import { supabase} from '../../../utils/supabase/client';


export default  function Add () {
    const [subjectName, setsubjectName] = useState("");
    const [loading, setLoading] = useState(false);


  const handleSave = async () => {
      if (!subjectName ) {
        alert("subjectName field are required");
        return;
      }

    try {
        setLoading(true);
        const { data, error } = await supabase
            .from("subjects")
            .insert([{ Name: subjectName}]);
        if (error) {
            throw error;
        }
        alert("Subject Added Successfully");
        setsubjectName("");
        }
       catch (error: any) {
            alert(error.message);
        }
        finally {
            setLoading(false);
        }

  }

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
      <div className="max-w-md w-full space-y-8 bg-gray-700 p-8 rounded-md shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Add Subject</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" placeholder='File Name' value={subjectName} onChange={(e) => setsubjectName(e.target.value)} className="input input-bordered w-full max-w-xs" />
 
        </div>
        <div className="mt-6 justify-center flex">
        <button className="btn btn-outline  btn-primary" onClick={handleSave}>ADD</button>

        </div>
      </div>
    </div>
  );
};

