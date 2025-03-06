import type {QueryData} from "@supabase/supabase-js";
import {
  foldersQuery,
  filesQuery,
  sharedSingleFileQuery,
  sharedFoldersQuery,
  sharedFilesQuery
} from "@/lib/supabase/supabaseQueries.ts";

export type Folders = QueryData<ReturnType<typeof foldersQuery>>;
export type Files = QueryData<ReturnType<typeof filesQuery>>;
export type sharedFile = QueryData<ReturnType<typeof sharedSingleFileQuery>>;
export type sharedFolders = QueryData<ReturnType<typeof sharedFoldersQuery>>;
export type sharedFiles = QueryData<ReturnType<typeof sharedFilesQuery>>;
