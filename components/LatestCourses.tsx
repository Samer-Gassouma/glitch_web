"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
interface Course {
  ResourceID: string;
  ResourceName: string;
  URL2: string;
  created_at: string;
  SubjectID: string;
}

const LatestCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
   
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('Resources')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) {
          throw error;
        }
        setCourses(data || []);
      }catch (error: any) {
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
        {courses.map((course 
         
        ) => (
         <div key={course.ResourceID} className="card w-50 bg-base-100 shadow-xl">
         <div className="card-body">
           <h2 className="card-title">{course.ResourceName}</h2>
           <p>{new Date(course.created_at).toLocaleDateString()}</p>
           <div className="card-actions justify-end">
            <Link href={`/Subjects/${course.SubjectID}/${course.ResourceID}`} key={course.ResourceID}> 
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
