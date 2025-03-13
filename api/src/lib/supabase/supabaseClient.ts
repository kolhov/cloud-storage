import { createClient } from '@supabase/supabase-js'
import type { Database } from "@/types/database.types.ts";
import * as process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);
