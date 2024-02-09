"use client"
import {supabase} from '@/utils/supabase/client';
import Link from 'next/link';
import FolderStructure from '../Subjects/folder_path/FolderStructure';
import { useState } from 'react';
const  page = () => {
    const [currentFolderSelected, setCurrentFolderSelected] = useState({} as any);

    console.log(currentFolderSelected);



      const handleDeleteFolder = async (id: string) => {
        const { error } = await supabase.from("folders").delete().eq("FolderID", id);
        if (error) {
          console.error("Error deleting folder", error);
          return;
        }
        console.log("Folder deleted");
        alert("Folder Deleted");
        ManageClose("conf_del");
        ManageClose("del_folder");
      };

        
        

        const ManageOpen = (id:string) => {
            const dialogElement = document.getElementById(id);
        
            if (dialogElement instanceof HTMLDialogElement) {
              dialogElement.showModal();
            } else {
              console.error('Element is not a dialog');
            }
        
          }
        
          const ManageClose = (id:string) => {
            const dialogElement = document.getElementById(id);
        
            if (dialogElement instanceof HTMLDialogElement) {
              dialogElement.close();
            } else {
              console.error('Element is not a dialog');
            }
        
          }

           
    return (
        <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold mb-8">Dark Path </h1>
        
        <div className="card w-100 bg-base-100 shadow-xl mb-6">
            <div className="card-body ">
                <h2 className="card-title">Course Section</h2>
                <div className="card-actions justify-center ">
                <button className="btn btn-primary">Add Course</button>
                <button className="btn btn-primary">Edit Course</button>
                <button className="btn btn-primary">Delete Course</button>
                </div>
            </div>
            </div>
            
            <dialog id="conf_del" className="modal">
            <div className="card w-96 bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Are you sure you want to delete this folder?</h2>
                    <p className='
                    text-2xl font-bold
                    '>{currentFolderSelected.name}</p>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={()=>handleDeleteFolder(currentFolderSelected.id)}>
                        Yes
                    </button>
                    <button className="btn btn-ghost" onClick={()=>ManageClose("conf_del")}>
                        Cancel
                    </button>
                    </div>
                </div>
                </div>
            </dialog>

            <dialog id="del_folder" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <FolderStructure currentFolderSelected={setCurrentFolderSelected} />
                <button   onClick={()=>ManageOpen("conf_del")} 
                className="btn btn-primary py-2 px-4 mt-4 w-1/2">Submit</button>
                <button   onClick={()=>ManageClose("del_folder")}
                className="btn btn-primary py-2 px-4 mt-4 w-1/2 ">Close</button>
              </div>
            </dialog>


    
          <div className="card w-100 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Folder Section</h2>
                <div className="card-actions justify-center ">
                <Link href={`/Subjects/AddFolder`}>
                    <button className="btn btn-primary" >Add Folder</button>
                </Link>
                
                <button className="btn" onClick={()=>ManageOpen("del_folder")}>Delete Folder</button>
                </div>
            </div>
            </div>
        </div>
      );
    };
export default page;