<script setup lang="ts">
import TopNavBar from "@/components/layout/TopNavBar.vue";
import {usePageStore} from "@/stores/pages.ts";
import {storeToRefs} from "pinia";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/sidebar/AppSidebar.vue";

const {pageData} = storeToRefs(usePageStore());
</script>

<template>
    <SidebarProvider>
      <AppSidebar />
      <main class="flex flex-col w-full">
        <TopNavBar>
          <SidebarTrigger />
        </TopNavBar>
        <div class="items-center p-4">
          <h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1>
          <slot />
        </div>
      </main>
    </SidebarProvider>
</template>

<style scoped>

</style>
