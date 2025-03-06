<script setup lang="ts">
import {type Ref, ref} from "vue";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import {usePageStore} from "@/stores/pages.ts";
import {projectsQuery} from "@/lib/supabase/supabaseQueries.ts";
import {columns} from "@/lib/table-columns/projectColumns.ts";
import type {Projects} from "@/lib/supabase/supabaseQueryTypes.ts";
import {useErrorStore} from "@/stores/errorStore.ts";

usePageStore().pageData.title = 'Projects';
const projects: Ref<Projects | null> = ref(null);

async function getAllProjects(){
  const {data, error, status} = await projectsQuery;

  if (error) useErrorStore().setError({error, customCode: status});
  projects.value = data;
}
await getAllProjects();

</script>

<template>
  <DataTable v-if="projects" :columns="columns" :data="projects"/>
</template>

<style scoped>

</style>
