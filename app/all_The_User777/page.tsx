"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UsersPage() {
  const [users, setUsers] = useState([] as any);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data);
  }

  return (
    <div className="p-4 justify-center items-center flex flex-col mt-10">
      <h1 className="text-2xl mb-4 ">Users ({users.length})</h1>
      <ul className="list-disc list-inside overflow-auto h-180 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        {users.map((user, index) => (
          <li key={index} className="mb-2">{user.email}</li>
        ))}
      </ul>
    </div>
  );
}