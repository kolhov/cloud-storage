import { QueryData } from '@supabase/supabase-js'
import { insertFileQuery } from '@/lib/supabase/supabaseQueries'

export type insertFile = QueryData<ReturnType<typeof insertFileQuery>>;