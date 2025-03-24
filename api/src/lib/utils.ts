import { Request } from 'express'
import { supabase } from '@/lib/supabase/supabaseClient'
import { deleteTokenQuery } from '@/lib/supabase/supabaseQueries'

//TODO refactor to middleware
export function getHeaderToken(req: Request){
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return undefined;
  }

  return authHeader.split(' ')[1];
}

export async function headerToUser(req: Request){
  const token = getHeaderToken(req);
  if (!token) return;

  const user = await supabase.auth.getUser(token);
  if (user.error) return;

  return user.data.user.id;
}

export async function deleteToken(id: string){
  const tokenDel = await deleteTokenQuery(id);
  if (tokenDel.error){
    console.error('Deletion error on token: ', id);
  }
}

export async function logError(text: string, object?: any){
  // TODO add to db logging table
  console.error(text, object);
}