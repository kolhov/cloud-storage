import { QueryData } from '@supabase/supabase-js'
import { insertFileQuery, filesQuery } from '@/lib/supabase/supabaseQueries'

export type InsertFile = QueryData<ReturnType<typeof insertFileQuery>>;
export type FilesQuery = QueryData<ReturnType<typeof filesQuery>>;