import {ref} from "vue";
import type {AuthError} from "@supabase/supabase-js";
import type {LoginForm} from "@/types/auth.types.ts";

type FormErrors<T> = {
  [K in keyof T]: string[]
}

export function useFormErrors(){
  const serverError = ref('');
  const formErrors = ref<FormErrors<LoginForm>>()

  function handleServerError(error: AuthError){
    serverError.value = error.message === "Invalid login credentials"
      ? 'Incorrect email or password'
      : error.message
  }

  async function loginFormValidation(formData: LoginForm){
    formErrors.value = {
      email: [],
      password: []
    };

    const { passwordValidation, emailValidation } = await import('@/lib/formValidation.ts');

    const emailErrors = emailValidation(formData.email);
    if (emailErrors.length) formErrors.value.email = emailErrors;

    const passwordErrors = passwordValidation(formData.password);
    if (passwordErrors.length) formErrors.value.password = passwordErrors;
  }

  return {
    serverError,
    handleServerError,
    loginFormValidation,
    formErrors
  }
}
