<script setup lang="ts">
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icon } from '@iconify/vue'
import Input from '../ui/input/Input.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'

const router = useRouter();
const {user} = storeToRefs(useAuthStore());

async function logoutEvent() {
  const { logout } = await import('@/lib/supabase/supaAuth.ts')
  const isLoggedOut = await logout()

  if (isLoggedOut) router.push('/login')
}

</script>

<template>
  <nav class="h-16 border-b bg-muted/40 flex gap-2 justify-between px-6 items-center">
    <slot />
    <form class="relative h-fit w-full max-w-96">
      <Icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
      ></Icon>
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
    </form>
    <DropdownMenu v-if="user">
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem @click="logoutEvent">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</template>
