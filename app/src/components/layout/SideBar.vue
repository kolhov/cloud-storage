<script setup lang="ts">
import {Icon} from "@iconify/vue";
import type {LinkProp} from "@/types/sidebar.linkprop.ts";
import SideBarLinks from "@/components/layout/SideBarLinks.vue";
import { Button } from "@/components/ui/button";
import {useRouter} from "vue-router";

const links: LinkProp[] = [
  {
    title: "Dashboard",
    to: "/",
    icon: "lucide:house"
  },
  {
    title: "Projects",
    to: "/projects",
    icon: "lucide:building-2"
  },
  {
    title: "My Tasks",
    to: "/tasks",
    icon: "lucide:badge-check"
  },
];

const accountLinks: LinkProp[] = [
  {
    title: "Profile",
    to: "/profile",
    icon: "lucide:user"
  },
  {
    title: "Settings",
    to: "/settings",
    icon: "lucide:settings"
  },
  {
    title: "Sign out",
    icon: "lucide:log-out"
  },
];

const router = useRouter();
async function actionClickedEvent(linkTitle: string){
  if (linkTitle === 'Sign out'){
    const { logout } = await import("@/lib/supabase/supaAuth.ts");
    const isLoggedOut = await logout();

    if (isLoggedOut) router.push('/login')
  }
}

</script>

<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 lg:w-52 w-16 transition-[width]"
  >
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button variant="outline" size="icon" class="w-8 h-8">
        <Icon icon="lucide:menu"></Icon>
      </Button>

      <Button variant="outline" size="icon" class="w-8 h-8">
        <Icon icon="lucide:plus"></Icon>
      </Button>
    </div>

    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SideBarLinks :links="links" />
      </div>

      <div class="border-y text-center bg-background py-3">
        <SideBarLinks :links="accountLinks" @actionClicked="actionClickedEvent"/>
      </div>
    </nav>
  </aside>
</template>

<style scoped>

</style>
