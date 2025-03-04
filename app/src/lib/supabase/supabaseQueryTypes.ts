import type {QueryData} from "@supabase/supabase-js";
import {
  profileQuery,
  projectQuery,
  projectsQuery, taskQuery,
  tasksWithProjectsQuery
} from "@/lib/supabase/supabaseQueries.ts";

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>;
export type Projects = QueryData<typeof projectsQuery>;
export type Project = QueryData<ReturnType<typeof projectQuery>>;
export type Task = QueryData<ReturnType<typeof taskQuery>>;
export type profile = QueryData<ReturnType<typeof profileQuery>>;
