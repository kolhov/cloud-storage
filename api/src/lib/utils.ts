import { Request, Response } from 'express'
import { supabase } from '@/lib/supabase/supabaseClient'

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

  const user = await supabase.auth.getUser(token)
  if (user.error) return;

  return user.data.user.id;
}