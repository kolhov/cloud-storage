import type {QueryData} from "@supabase/supabase-js";
import {
  foldersQuery,
  filesQuery,
  sharedSingleFileQuery,
  sharedFoldersQuery,
  sharedFilesQuery, getAllFoldersQuery
} from '@/lib/supabase/supabaseQueries.ts'

export type Folders = QueryData<ReturnType<typeof foldersQuery>>;
export type Files = QueryData<ReturnType<typeof filesQuery>>;
export type allFolders = QueryData<ReturnType<typeof getAllFoldersQuery>>;
export type SharedFile = QueryData<ReturnType<typeof sharedSingleFileQuery>>;
export type SharedFolders = QueryData<ReturnType<typeof sharedFoldersQuery>>;
export type SharedFiles = QueryData<ReturnType<typeof sharedFilesQuery>>;
