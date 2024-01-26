"use client"
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';



const SubjectDetails = () => {
  
  const router = useRouter();
  const [Resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [folders, setFolders] = useState([]);
  

  
  const id  = usePathname().replace("/Subjects/", "")
  
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const { data, error } = await supabase
        .from("Resources") 
        .select("*")
        .eq("SubjectID", id);
        setResources(data);

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
    const fetchFolders = async () => {
      try {
        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('SubjectID', id)
          .eq('ParentFolderID', 0);
        if (error) {
          throw error;
        }
        setFolders(data || []);
      } catch (error) {
        setError(true);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
    if(id){
      
      fetchFolders()
      fetchSubject()
    }


  }, []);
  Resources.map((resource) => {
    resource.is_folder = false;
  });

  folders.map((folder) => {
    folder.is_folder = true;
  });
  
  const resources = [...folders, ...Resources];
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

  if (!Resources && !folders) {
    return <p>Resources not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-7">
      <h1 className="text-3xl font-bold text-center mb-8">Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resources.map((R) => (
          R.is_folder == false ?
          <Link href={`/Subjects/${id}/${R.ResourceID}`} key={R.ResourceID}>
          <div className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <div className="p-4 md:p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {R.ResourceName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(R.created_at).toLocaleDateString()}   
                  </p>
                </div>
                <div className="ps-3">
                  <svg className="flex-shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
          :
          <Link href={`/${R.FolderID}`} key={R.FolderID}>
          <div className="group flex flex-col bg-blue-200 border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <div className="p-4 md:p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H9l-2 4H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {R.FolderName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(R.created_at).toLocaleDateString()}   
                  </p>
                </div>
                <div className="ps-3">
                  <svg className="flex-shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectDetails;
