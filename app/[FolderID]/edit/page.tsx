"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

const Edit = () => {
  const id = usePathname().replace("/Subjects/", "").split("/")[1];
  const [FolderName, setFolderName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState([] as any);
  const [subjects, setSubjects] = useState([] as any);
  const [selectedParentFolder, setSelectedParentFolder] = useState([] as any);
  const [ParentFolder, setParentFolder] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetchFile();
    fetchSubjects();
  }, []);



  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*");

      if (error) {
        console.error("Error fetching subjects:", error.message || error);
      } else {
        setSubjects(data);
      }
    }catch (error: any) {
      console.error("Error fetching subjects:", error.message || error);
    }finally {
      setLoading(false);
    }

  };
  const fetchFile = async () => {
    try {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("FolderID", id)
        .single();

      if (error) {
        console.error("Error fetching file:", error.message || error);
      } else {

        setFolderName(data.FolderName); 
        setSelectedSubject(data.SubjectID);
        setSelectedParentFolder(data.ParentFolderID);
      }
    }catch (error: any) {
      console.error("Error fetching file:", error.message || error);
    }finally
    {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Handle the save operation here.
    try {
      if (!FolderName || !selectedSubject ) {
        alert("All fields are required");
        return;
      }
  
      // Update the file details in the Resources table
      const { data: updateData, error: updateError } = await supabase
        .from('folders')
        .update({
          FolderName: FolderName,
          SubjectID: selectedSubject,
          ParentFolderID: selectedParentFolder,
        })
        .eq('FolderID', id);
  
      if (updateError) {
        console.error("Error updating file details:", updateError.message || updateError);
        setMessage("Error updating file details");
      } else {
        alert("File details updated successfully!");
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Edit Folder</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" value={FolderName} onChange={(e) => setFolderName(e.target.value)} className="input input-bordered w-full max-w-xs" />

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

            <select 
              value={selectedParentFolder}
              onChange={(e) => setSelectedParentFolder(e.target.value)}
            className="select select-bordered w-full max-w-xs">
              <option>Parent Folder</option>
                {ParentFolder.map((folder:any) => (
                    <option key={folder.FolderID} value={folder.FolderID}>
                    {folder.FolderName}
                    </option>
                ))}
            </select>

           

        </div>

        <div className="mt-6 justify-center flex">
        <button className="btn btn-outline btn-secondary" onClick={handleSave}>Upadte</button>

        </div>
      </div>
    </div>
  );
};

export default Edit;