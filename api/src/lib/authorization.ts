import { NextFunction, Request, Response } from 'express'
import { supabase } from '@/lib/supabase/supabaseClient'

export function getHeaderToken(req: Request){
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return undefined;
  }

  return authHeader.split(' ')[1];
}

/*
*An Express middleware for authorization that adds a userId field to the request body.
*/
export async function authorize(req: Request, res: Response, next: NextFunction){
  const token = getHeaderToken(req);
  if (!token) {
    res.sendStatus(403);
    return;
  }

  const {data, error} = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    res.sendStatus(403);
    return;
  }

  req.body.userId = data.user.id;
  next();
}