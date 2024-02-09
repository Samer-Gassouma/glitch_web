import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

const FolderTree = ({ folder }) => {
  const [subfolders, setSubfolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = async (folderId) => {
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
        setExpanded(true);
      } catch (error) {
        console.error('Error fetching subfolders:', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setExpanded(false);
      setSubfolders([]);
    }
  };

  return (
    <ul>
      <li>
        <span
          className={`cursor-pointer hover:underline ${expanded ? 'font-bold' : ''}`}
          onClick={() => handleClick(folder.FolderID)}
        >
          . {folder.FolderName}
        </span>
        {loading ? (
          <div>Loading...</div>
        ) : subfolders.length > 0 ? (
          <FolderTreeList subfolders={subfolders} />
        ) : null}
      </li>
    </ul>
  );
};

const FolderTreeList = ({ subfolders }) => (
  <ul className="ml-4">
    {subfolders.map((subfolder) => (
      <FolderTree key={subfolder.FolderID} folder={subfolder} />
    ))}
  </ul>
);

export default FolderTree;
