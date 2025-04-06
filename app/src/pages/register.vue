<script setup lang="ts">
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from '@/components/ui/button'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {ref} from "vue";
import {supabase} from "@/lib/supabase/supabaseClient.ts";
import {useRouter} from "vue-router";
import {register} from "@/lib/supabase/supaAuth.ts";
import { watchDebounced } from '@vueuse/core'
import { useFormErrors } from '@/composables/formErrors.ts'

const router = useRouter()
const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function signup(){
  const isRegistered = await register(formData.value);
  if (isRegistered) router.push('/')
}

const { handleServerError, serverError, loginFormValidation, formErrors } = useFormErrors();
watchDebounced(
  formData,
  () => {
    loginFormValidation(formData.value)
  }, { debounce: 1000, deep: true }
)
</script>

<template>
  <div
    class="mx-auto w-full flex justify-center items-center p-10 text-center -mt-10 min-h-[90vh] h-full"
  >
    <Card class="max-w-sm w-full mx-auto h-full">
      <CardHeader>
        <CardTitle class="text-2xl"> Register</CardTitle>
        <CardDescription> Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" disabled class="w-full"> Register with Google</Button>
          <Separator label="Or"/>
        </div>
        <form class="grid gap-4" @submit.prevent="signup">
          <div class="grid gap-2">
            <Label id="email" class="text-left">Email</Label>
            <Input id="email" type="email"
                   placeholder="johndoe19@example.com"
                   required
                   v-model="formData.email"
                   :class="{'border-red-500': serverError}"/>
            <ul class="text-sm text-left text-red-500 pl-4" v-if="formErrors?.email.length">
              <li class="list-disc" v-for="err in formErrors.email" :key="err">
                {{err}}
              </li>
            </ul>
          </div>

          <div class="grid gap-2">
            <Label id="password" class="text-left">Password</Label>
            <Input id="password" type="password" placeholder="*****" autocomplete required
                   v-model="formData.password"/>
          </div>

          <div class="grid gap-2">
            <Label id="confirm_password" class="text-left">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="*****"
              autocomplete
              required
              :class="{'border-red-500': serverError}"
              v-model="formData.confirmPassword"
            />
            <ul class="text-sm text-left text-red-500 pl-4" v-if="formErrors?.password.length">
              <li class="list-disc" v-for="err in formErrors.password" :key="err">
                {{err}}
              </li>
            </ul>
          </div>
          <Button type="submit" class="w-full"> Register</Button>
          <!-- <Button variant="outline" class="w-full"> Login with Google </Button> -->
        </form>
        <div class="mt-4 text-sm text-center">
          Already have an account?
          <RouterLink to="/login" class="underline"> Login</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
