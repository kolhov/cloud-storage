import type { Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import type { Tables } from '@/types/database.types.ts'

export interface FolderTreeNode extends Tables<'folders'>{
  folders: FolderTreeNode[]
}
