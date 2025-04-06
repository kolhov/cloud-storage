<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'
import SearchBar from '@/components/layout/SearchBar.vue'
import { useStorageStore } from '@/stores/storageStore.ts'

const router = useRouter();
const { user } = storeToRefs(useAuthStore());

async function logoutEvent() {
  const { logout } = await import('@/lib/supabase/supaAuth.ts');
  const isLoggedOut = await logout();

  if (isLoggedOut) {
    useStorageStore().cleanStore();
    router.push('/login');
  }
}

</script>

<template>
  <nav class="h-16 border-b bg-muted/40 flex gap-2 justify-start px-6 items-center w-full">
    <slot />
    <div class="flex gap-2 w-full justify-end items-center">
    <SearchBar/>
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
    </div>
  </nav>
</template>
