"use client"
import React, { useState, useEffect } from 'react';
import { supabase,firebaseApp,storage} from '../../../utils/supabase/client';
import { useSearchParams  } from 'next/navigation'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import FolderStructure from '../folder_path/FolderStructure';

export default  function Add () {
    const searchParams = useSearchParams()
    const [resourceName, setResourceName] = useState("");
    const [selectedSubject, setSelectedSubject] = useState([] as any);
    const [subjects, setSubjects] = useState([] as any);;
    const [visibilityMode, setVisibilityMode] = useState("Read" as "Read" | "Download");
    const [file, setFile] = useState([] as any);;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const  userId  = searchParams.get('userId')
    const [uploadProgress, setUploadProgress] = useState(0);
    const [progressUpload, setProgressUpload] = useState(0);
    const [downloadURL, setDownloadURL] = useState('')
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
      if (!resourceName || !selectedSubject || !file ) {
        alert("All fields are required");
        return;
      }
    
      try {
        const filePath = `${resourceName}${new Date().getTime()}.${file.type.split('/')[1]}`;
        
        
        const {data, error} = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
         
        });
        if (error) {
          throw error;
        }

        const storageRef = ref(getStorage(), filePath)
        const uploadTask = uploadBytesResumable(storageRef, file)
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
  
            setProgressUpload(progress) 
            console.log('Upload is ' + progress + '% done')
  
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            console.error(error.message)
          },
         
          async () => {

            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadURL(downloadURL)
            const { data, error } = await supabase
              .from("Resources")
              .insert([
                {
                  ResourceName: resourceName,
                  SubjectID: selectedSubject,
                  URL: filePath,
                  FolderID: currentFolderSelected.id ,
                  VisibilityMode: visibilityMode,
                  UserID: userId,
                  URL2: downloadURL,
                },
              ]);
            if (error) {
              throw error;
            }
            alert("Resource added successfully");
            setResourceName("");
            setSelectedSubject([]);
            setVisibilityMode("Read");
            setFile([]);
            setUploadProgress(0);
            setProgressUpload(0);
            setDownloadURL('')
            setCurrentFolderSelected({});
          }
        )
       
    }catch (error: any) {
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Add Resource</h2>
        </div>
        <div className="space-y-4 justify-center items-center flex flex-col">
            <input type="text" placeholder='File Name' value={resourceName} onChange={(e) => setResourceName(e.target.value)} className="input input-bordered w-full max-w-xs" />

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
             <p>Selected Folder:  {currentFolderSelected && currentFolderSelected.name &&  <span className="text-emerald-300">{currentFolderSelected.name}</span>}</p>
             <button className="btn" onClick={()=> ManageOpen()} >open Folder Stuct</button>
            <dialog id="fold11" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <FolderStructure currentFolderSelected={setCurrentFolderSelected} />
                <button   onClick={()=>ManageClose()}
                className="btn btn-primary py-2 px-4 mt-4 w-full">Close</button>
              </div>
            </dialog>
            <select className="select select-bordered w-full max-w-xs" value={visibilityMode} onChange={(e) => setVisibilityMode(e.target.value as "Read" | "Download")}>
              <option>Visibility</option>
              <option value="Read">Read</option>
              <option value="Download">Download</option>
            </select>
            <input type="file" 
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}

            className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
           
            <p className="text-white">Upload Progress to the  bucket : {progressUpload}</p>
            <progress className="progress progress-primary w-56" value={progressUpload} max="100"></progress>
        </div>
        <div className="mt-6 justify-center flex">
        <button className="btn btn-outline  btn-primary" onClick={handleSave}>ADD</button>

        </div>
      </div>
    </div>
  );
};

