import type {QueryData} from "@supabase/supabase-js";
import {
  foldersQuery,
  filesQuery,
  sharedSingleFileQuery,
  sharedFoldersQuery,
  sharedFilesQuery, getAllFoldersQuery, insertFolderQuery, folderQuery
} from '@/lib/supabase/supabaseQueries.ts'

export type Folders = QueryData<ReturnType<typeof foldersQuery>>;
export type Folder = QueryData<ReturnType<typeof folderQuery>>;
export type Files = QueryData<ReturnType<typeof filesQuery>>;
export type allFolders = QueryData<ReturnType<typeof getAllFoldersQuery>>;
export type SharedFile = QueryData<ReturnType<typeof sharedSingleFileQuery>>;
export type SharedFolders = QueryData<ReturnType<typeof sharedFoldersQuery>>;
export type SharedFiles = QueryData<ReturnType<typeof sharedFilesQuery>>;
export type InsertFolder = QueryData<ReturnType<typeof insertFolderQuery>>;
