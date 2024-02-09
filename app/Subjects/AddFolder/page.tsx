"use client"
import React, { useState, useEffect } from 'react';
import { supabase} from '../../../utils/supabase/client';
import FolderStructure from '../folder_path/FolderStructure';


export default  function Add () {
    const [FolderName, setFolderName] = useState("");
    const [subjects, setSubjects] = useState([] as any);
    const [selectedSubject, setSelectedSubject] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentFolderSelected , setCurrentFolderSelected] = useState({} as any);
  useEffect(() => {
    fetchSubjects();

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


  const handleSave = async () => {
      if(!FolderName || !selectedSubject){
        alert("Please Fill All Fields");
          return;
      }
      try{
        if (currentFolderSelected.id == undefined) {
        const { data, error } = await supabase.from('folders').insert([{ FolderName: FolderName, SubjectID: selectedSubject, ParentFolderID: 0}]);
          
        }
        else{
        const { data, error } = await supabase.from('folders').insert([{ FolderName: FolderName, SubjectID: selectedSubject, ParentFolderID: currentFolderSelected.id}]);
          }
        if (error) {
          throw error;
        }
        setFolderName("");
        setSelectedSubject([]);
        setCurrentFolderSelected({});
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

  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-900 py-2 px-4">
        <h1 className="text-3xl font-bold text-white">Error Fetching Data</h1>
      </div>
    );
  }

  const ManageOpen = () => {
    const dialogElement = document.getElementById('fold11');

    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal();
    } else {
      console.error('Element is not a dialog');
    }

  }

  const ManageClose = () => {
    const dialogElement = document.getElementById('fold11');

    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.close();
    } else {
      console.error('Element is not a dialog');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-900 py-2 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-700 p-8 rounded-md shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Add Folder</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" placeholder='File Name' value={FolderName} onChange={(e) => setFolderName(e.target.value)} className="input input-bordered w-full max-w-xs" />
            
            <p>Selected Folder:  {currentFolderSelected && currentFolderSelected.name &&  <span className="text-emerald-300">{currentFolderSelected.name}</span>}</p>
            <button className="btn" onClick={()=> ManageOpen} >open Folder Stuct</button>
            <dialog id="fold11" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <FolderStructure currentFolderSelected={setCurrentFolderSelected} />
                <button   onClick={()=>ManageClose}
                className="btn btn-primary py-2 px-4 mt-4 w-full">Close</button>
              </div>
            </dialog>
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

