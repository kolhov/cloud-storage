import {supabase} from "@/lib/supabase/supabaseClient.ts";
import type {LoginForm, RegisterForm} from "@/types/auth.types.ts";

export async function register(formData: RegisterForm){
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) return  console.log("Signup err: ", error);

  return true
}

export async function login(formData: LoginForm){
  const {data, error} = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  })

  return {error}
}

export async function logout(){
  const {error} = await supabase.auth.signOut();
  if(error) return console.log(error)

  return true
}
