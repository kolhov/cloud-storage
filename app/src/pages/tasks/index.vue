<script setup lang="ts">
import {type Ref, ref} from "vue";
import DataTable from "@/components/ui/data-table/DataTable.vue";
import {usePageStore} from "@/stores/pages.ts";
import {tasksWithProjectsQuery} from "@/lib/supabase/supabaseQueries.ts";
import {columns} from "@/lib/table-columns/taskColumns.ts";
import type {TasksWithProjects} from "@/lib/supabase/supabaseQueryTypes.ts";
import {useErrorStore} from "@/stores/errorStore.ts";

usePageStore().pageData.title = 'Tasks';
const tasks: Ref<TasksWithProjects | null> = ref(null);

async function getAllTasks(){
  const {data, error, status} = await tasksWithProjectsQuery;

  if (error) useErrorStore().setError({error, customCode: status});
  tasks.value = data;
}
await getAllTasks();

</script>

<template>
  <DataTable v-if="tasks" :columns="columns" :data="tasks" />
</template>

<style scoped>

</style>
