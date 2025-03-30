import { deleteTokenQuery } from '@/lib/supabase/supabaseQueries'

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