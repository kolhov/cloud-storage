import type {QueryData} from "@supabase/supabase-js";
import {
  foldersQuery,
  filesQuery
} from "@/lib/supabase/supabaseQueries.ts";

export type Folders = QueryData<ReturnType<typeof foldersQuery>>;
export type Files = QueryData<ReturnType<typeof filesQuery>>;
