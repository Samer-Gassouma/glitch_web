"use client"
import React, { useState, useEffect } from 'react';
import { supabase} from '../../../utils/supabase/client';



export default  function Add () {
    const [FolderName, setFolderName] = useState("");
    const [subjects, setSubjects] = useState([] as any);
    const [selectedSubject, setSelectedSubject] = useState([] as any);
    const [ParentFolder, setParentFolder] = useState([] as any);
    const [selectedParentFolder, setSelectedParentFolder] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchFolder();

  }, []);



  const fetchSubjects = async () => {
   
    try{
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) {
      throw error;
    }
    setSubjects(data);
    }catch (error: any) {
        console.error("Error fetching subjects:", error.message || error);
    }
    finally {
        setLoading(false);
    }

  };

  const fetchFolder = async () => {
    try{
    const { data, error } = await supabase.from('folders').select('*');
    if (error) {
      throw error;
    }
    console.log(data);
    setParentFolder(data);
    }catch (error: any) {
        console.error("Error fetching subjects:", error.message || error);
    }
    finally {
        setLoading(false);
    } 
  }

  const handleSave = async () => {
      if(!FolderName || !selectedSubject){
        alert("Please Fill All Fields");
          return;
      }
      try{
        if (selectedParentFolder.length == 0) {
        const { data, error } = await supabase.from('folders').insert([{ FolderName: FolderName, SubjectID: selectedSubject, ParentFolderID: 0 }]);
          
        }
        else{
        const { data, error } = await supabase.from('folders').insert([{ FolderName: FolderName, SubjectID: selectedSubject, ParentFolderID: selectedParentFolder }]);
          }
        if (error) {
          throw error;
        }
        setFolderName("");
        setSelectedSubject([]);
        setSelectedParentFolder([]);
        alert("Folder Added Successfully");
      }catch (error: any) {
          console.error("Error fetching subjects:", error.message || error);
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Add Folder</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" placeholder='File Name' value={FolderName} onChange={(e) => setFolderName(e.target.value)} className="input input-bordered w-full max-w-xs" />
            
            <select className="select select-bordered w-full max-w-xs" value={selectedParentFolder} onChange={(e) => setSelectedParentFolder(e.target.value as "Read" | "Download")}>
              <option>ParentFolder</option>
              <option value="">None</option>
              {ParentFolder.map((PFolder : any) => (
                    <option key={PFolder.FolderID} value={PFolder.FolderID}>
                    {PFolder.FolderName}
                    </option>
                ))}
            </select>
           
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            className="select select-bordered w-full max-w-xs">
              <option>Subject</option>
                {subjects.map((subject:any) => (
                    <option key={subject.id} value={subject.id}>
                    {subject.Name}
                    </option>
                ))}
            </select>
            

           
            
        </div>
        <div className="mt-6 justify-center flex">
        <button className="btn btn-outline  btn-primary" onClick={handleSave}>ADD</button>

        </div>
      </div>
    </div>
  );
};

