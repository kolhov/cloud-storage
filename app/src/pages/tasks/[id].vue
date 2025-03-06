<script setup lang="ts">
import {ref, watch} from "vue";
import type {Task} from "@/lib/supabase/supabaseQueryTypes.ts";
import {usePageStore} from "@/stores/pages.ts";
import {taskQuery} from "@/lib/supabase/supabaseQueries.ts";
import {useRoute} from "vue-router";
import {Table, TableCell, TableHead, TableRow} from "@/components/ui/table";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Icon} from "@iconify/vue";
import {useErrorStore} from "@/stores/errorStore.ts";
import {Button} from "@/components/ui/button"

const route = useRoute('/tasks/[id]');
const task = ref<Task | null>(null);
watch(
  () => task.value?.name,
  () => usePageStore().pageData.title = `Task: ${task.value?.name || ''}`
)

async function getTask(){
  const { data, error, status } = await taskQuery(+route.params.id);
  if (error) useErrorStore().setError({error, customCode: status});

  task.value = data;
}

await getTask();
</script>

<template>
  <Table v-if="task">
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell> {{ task?.name }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell> {{ task.description }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Assignee </TableHead>
      <TableCell> </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Project </TableHead>
      <TableCell class="p-0">
        <RouterLink class="w-full h-full hover:bg-muted block p-4" :to="`/projects/${task.projects?.slug}`">
          {{ task.projects?.name}}
        </RouterLink>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Status </TableHead>
      <TableCell> {{ task.status }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Collaborators </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar
            class="-mr-4 border border-primary hover:scale-110 transition-transform"
            v-for="collab in task.collaborators"
            :key="collab"
          >
            <RouterLink class="w-full h-full flex items-center justify-center" to="">
              <AvatarImage src="" alt="" />
              <AvatarFallback> {{collab}} </AvatarFallback>
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
    <TableRow class="hover:bg-transparent">
      <TableHead class="align-top pt-4"> Comments </TableHead>
      <TableCell>
        Comments cards goes in here..
        <div class="flex flex-col justify-between p-3 bg-muted my-2 rounded-md">
          <textarea
            placeholder="Add your comment.."
            class="w-full max-w-full overflow-y-auto prose-sm prose border rounded dark:prose-invert hover:border-muted bg-background border-muted p-3"
          >
          </textarea>
          <div class="flex justify-between mt-3">
            <Button> Comment </Button>
            <div class="flex gap-4">
              <button variant="ghost" @click.prevent>
                <icon icon="lucide:paperclip"></icon>
                <span class="sr-only">Attach file</span>
              </button>
              <button variant="ghost" @click.prevent>
                <icon icon="lucide:image-up"></icon>
                <span class="sr-only">Upload image</span>
              </button>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  </Table>
</template>
