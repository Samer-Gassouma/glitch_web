"use client"
import { useEffect, useState } from 'react';
import FolderTree from './FolderTree';
import { supabase } from '@/utils/supabase/client';

const FolderStructure = ({currentFolderSelected}:any) => {
  const [rootFolder, setRootFolder] = useState([] as any);
  const [selectedFolder, setSelectedFolder] = useState({} as any);

  useEffect(() => {
    fetchRootFolder();
  }, []);
  currentFolderSelected(selectedFolder);

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
    <p className="text-white">
        Selected Folder:  {selectedFolder && selectedFolder.name &&
        <span className="text-emerald-300">{selectedFolder.name}</span>}
    </p>
    <div className="w-full flex items-center justify-between mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={fetchRootFolder}>Refresh</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSelectedFolder({})}>Clear</button>
    </div>
    <div className="w-full">
        {rootFolder && rootFolder.map((folder: any) => (
            <FolderTree key={folder.FolderID} folder={folder} 
            onSelectFolder={setSelectedFolder}
            />
        ))}
    </div>
</div>
  );
};

export default FolderStructure;
