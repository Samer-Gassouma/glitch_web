"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

const LatestCourses: React.FC = () => {


  const [courses, setCourses] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: resourcesData, error: resourcesError } = await supabase
        .from('Resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
  
      if (resourcesError) {
        throw resourcesError;
      }
  
      const folderIDs = resourcesData.map(resource => resource.FolderID);
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .in('FolderID', folderIDs);
  
      if (foldersError) {
        throw foldersError;
      }
  
      const combinedData = resourcesData.map(resource => ({
        ...resource,
        folder: foldersData.find(folder => folder.FolderID === resource.FolderID),
      }));
    
      setCourses(combinedData);
      } catch (error: any) {
        setError(true);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  
  }, []);

  
  
 

  return (
    <div className="container mx-auto p-16 mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Courses</h1>

      {loading &&<span className="loading loading-bars loading-md"></span>}
      {error && <p className="text-red-500 text-center">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course :any) => (
         <div key={course.ResourceID} className="card w-50 bg-base-100 shadow-xl">
         <div className="card-body">
           <h2 className="card-title">{course.ResourceName}</h2>
           <p>{new Date(course.created_at).toLocaleDateString()}</p>
           <p className='text-sm '>
              folder : {course.folder && course.folder.FolderName ? course.folder.FolderName : 'No Path'}
           </p >
           <div className="card-actions justify-end">
            <Link href={`${course.URL2}`}  target="_blank" key={course.ResourceID}> 
             <button className="btn btn-primary">Check this Course </button>
              </Link>
           </div>
         </div>
       </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <p className="text-gray-600 text-center mt-8">No courses available.</p>
      )}

      <div className="flex justify-center mt-8">
        <Link href='/Subjects'>
      <button
        className="btn btn-accent btn-outline">
        View More
        </button>
        </Link>
      </div>
    </div>
  );
};

export default LatestCourses;
