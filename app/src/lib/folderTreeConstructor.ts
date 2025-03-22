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

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i]
    if (folder.folder === null) break
    if (folder.folder in memo) {
      const indexes = memo[folder.folder];
      if (indexes.length === 1) {
        const length = tree[indexes[0]].folders.push({
          ...folders.splice(i, 1)[0],
          folders: []
        } as FolderTreeNode)
        memo[folder.id] = [...memo[folder.folder], length - 1]
        i--;
        continue;
      }

      let treePointer = tree
      for (let x = 0; x < indexes.length; x++) {
        treePointer = treePointer[indexes[x]].folders
      }
      const length = treePointer.push({ ...folders.splice(i, 1)[0], folders: [] } as FolderTreeNode)
      memo[folder.id] = [[...memo[folder.folder]].push(length - 1)]
      i--;
    }
  }
  console.log(tree)
  return tree
}
