import { Request } from 'express'

export function getHeaderToken(req: Request){
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return undefined;
  }

  return authHeader.split(' ')[1];
}