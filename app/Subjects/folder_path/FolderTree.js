import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import FolderStructure from './FolderStructure';

const FolderTree = ({ folder, onSelectFolder }) => {
  const [subfolders, setSubfolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null); 

  const handleClick = async (folderId, folderName) => {
    if (!expanded) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('ParentFolderID', folderId);
        if (error) {
          throw error;
        }
        setSubfolders(data);
        setSelectedFolder({ id: folderId, name: folderName });
        setExpanded(true);
      } catch (error) {
        console.error('Error fetching subfolders:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setExpanded(false);
      setSubfolders([]);
      setSelectedFolder(null); 
    }
  };

  const handleSelectFolder = (folderId, folderName) => {
    onSelectFolder({ id: folderId, name: folderName }); 
  };

  return (
    <ul>
      <li>
        <span
          className={`cursor-pointer hover:underline ${expanded ? 'font-bold' : ''}`}
          onClick={() => {
            handleClick(folder.FolderID, folder.FolderName);
            handleSelectFolder(folder.FolderID, folder.FolderName);
          }}
        >
          . {folder.FolderName}
        </span>
        {loading ? (
          <div>Loading...</div>
        ) : subfolders.length > 0 ? (
          <FolderTreeList subfolders={subfolders} onSelectFolder={onSelectFolder} />
        ) : null}
      </li>
    </ul>
  );
};

const FolderTreeList = ({ subfolders, onSelectFolder }) => (
  <ul className="ml-4">
    {subfolders.map((subfolder) => (
      <FolderTree key={subfolder.FolderID} folder={subfolder} onSelectFolder={onSelectFolder} />
    ))}
  </ul>
);

export default FolderTree;