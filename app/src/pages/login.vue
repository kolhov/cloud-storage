<script setup lang="ts">
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {login} from "@/lib/supabase/supaAuth.ts";
import {useFormErrors} from "@/composables/formErrors.ts";
import {watchDebounced} from "@vueuse/core";

const { handleServerError, serverError, loginFormValidation, formErrors } = useFormErrors();
const router = useRouter();
const formData = ref({
  email: '',
  password: ''
})

async function signIn(){
  const {error} = await login(formData.value)
  if (!error) return  router.push('/')

  handleServerError(error);
}

watchDebounced(
  formData,
  () => {
    loginFormValidation(formData.value)
  }, { debounce: 1000, deep: true }
)

</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" class="w-full"> Register with Google </Button>
          <Separator label="Or" />
        </div>

        <form class="grid gap-4" @submit.prevent="signIn">
          <div class="grid gap-2">
            <Label id="email" class="text-left">Email</Label>
            <Input type="email"
                   placeholder="johndoe19@example.com"
                   required
                   :class="{'border-red-500': serverError}"
                   v-model="formData.email"
            />
            <ul class="text-sm text-left text-red-500" v-if="formErrors?.email.length">
              <li class="list-disc" v-for="err in formErrors.email" :key="err">
                {{err}}
              </li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label id="password">Password</Label>
              <a href="#" class="inline-block ml-auto text-xs underline"> Forgot your password? </a>
            </div>
            <Input id="password"
                   type="password"
                   autocomplete
                   required
                   :class="{'border-red-500': serverError}"
                   v-model="formData.password" />
            <ul class="text-sm text-left text-red-500" v-if="formErrors?.password.length">
              <li class="list-disc" v-for="err in formErrors.password" :key="err">
                {{err}}
              </li>
            </ul>
          </div>
          <ul class="text-sm text-left text-red-500" v-if="serverError">
            <li class="list-disc">
              {{serverError}}
            </li>
          </ul>
          <Button type="submit" class="w-full"> Login </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <RouterLink to="/register" class="underline"> Register </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
