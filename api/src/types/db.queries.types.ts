import { QueryData } from '@supabase/supabase-js'
import { insertFileQuery, filesInFolderQuery } from '@/lib/supabase/supabaseQueries'

export type InsertFile = QueryData<ReturnType<typeof insertFileQuery>>;
export type FilesQuery = QueryData<ReturnType<typeof filesInFolderQuery>>;