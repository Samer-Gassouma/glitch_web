"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';


const Subjects = () => {
  const [Subjects, setSubjects] = useState([] as any);
  const [Folders, setFolders] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
        if (error) {
          throw error;
        }
        setSubjects(data || []);
      }catch (error: any) {
        setError(true);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);
  return (
    <div className=" mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 mt-16 text-center">Subjects</h1>
      {loading && <span className="loading loading-bars loading-md"></span>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Subjects.map((subject : any) => (
          <Link href={`/Subjects/${subject.id}`} key={subject.id}>
            <div className="card w-full sm:w-72 md:w-96 bg-primary text-primary-content shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
              <div className="card-body">
                <h2 className="card-title">{subject.Name}</h2>
                <div className="card-actions justify-end">
                  <button className="btn">Open</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
