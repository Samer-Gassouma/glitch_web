"use client"
import { useEffect, useState } from 'react';
import FolderTree from './FolderTree';
import { supabase } from '@/utils/supabase/client';

const FolderStructure = () => {
  const [rootFolder, setRootFolder] = useState([] as any);

  useEffect(() => {
    fetchRootFolder();
  }, []);

  const fetchRootFolder = async () => {
    try {
      const { data: rootFolderData, error } = await supabase.from('folders').select('*').eq('ParentFolderID', 0);

      if (error) {
        throw error;
      }

      if (rootFolderData.length > 0) {
        setRootFolder(rootFolderData);
      }
    } catch (error: any) {
      console.error('Error fetching root folder:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-600 p-7 rounded-lg shadow-lg mt-4 w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-white">Folder Structure</h2>
    <div className="w-full">
        {rootFolder && rootFolder.map((folder: any) => (
            <FolderTree key={folder.FolderID} folder={folder} />
        ))}
    </div>
</div>
  );
};

export default FolderStructure;
