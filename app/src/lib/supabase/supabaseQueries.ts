import {supabase} from "@/lib/supabase/supabaseClient.ts";

export const tasksWithProjectsQuery = supabase
  .from('tasks')
  .select(`
  *,
  projects(
    id,
    name,
    slug
    )
  `);

export const projectsQuery = supabase
  .from('projects')
  .select();

export const projectQuery = (slug: string) => supabase
  .from('projects')
  .select(`
  *,
  tasks(
    id,
    name,
    status,
    due_date
  )`)
  .eq('slug', slug)
  .single();

export const taskQuery = (id: number) => supabase
  .from('tasks')
  .select(`
  *,
  projects(
    id,
    name,
    slug
  )`)
  .eq('id', id)
  .single();

export const profileQuery = (id: string) => supabase
  .from('profiles')
  .select()
  .eq('id', id)
  .single();



















