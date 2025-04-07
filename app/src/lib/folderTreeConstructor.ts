import type { Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'

export function folderTreeConstructor(folders: Folders): FolderTreeNode[] {
  const tree: FolderTreeNode[] = [];
  const memo: Record<string, number[]> = {};

  // Get all root folders
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].folder === null) {
      const folderId = folders[i].id;
      const length = tree.push({
        ...folders.splice(i, 1)[0],
        folders: []
      } as FolderTreeNode);
      memo[folderId] = [length - 1];
      i--;
    }
  }

  let i = 0;
  let iterationCounter = 0;
  const retries = 20;       // The number of iterations in the worst case.

  while (folders.length > 0) {
    if (i >= folders.length) {
      i = 0;
      iterationCounter++;
      if (iterationCounter === retries){
        console.log("There is orphaned folders or too many folders")
        break;
      }
    }

    const folder = folders[i];

    if (!folder || folder.folder === null) break;
    if (folder.folder in memo) {
      const indexes = memo[folder.folder];
      if (indexes.length === 1) {
        const length = tree[indexes[0]].folders.push({
          ...folders.splice(i, 1)[0],
          folders: []
        } as FolderTreeNode);
        memo[folder.id] = [...memo[folder.folder], length - 1];
        continue;
      }

      let treePointer = tree;
      for (let x = 0; x < indexes.length; x++) {
        treePointer = treePointer[indexes[x]].folders;
      }
      const length = treePointer.push({ ...folders.splice(i, 1)[0], folders: [] } as FolderTreeNode);
      memo[folder.id] = [[...memo[folder.folder]].push(length - 1)];
    }

    i++;
  }

  return tree;
}
