<script setup lang="ts">
import { useRoute } from 'vue-router'
import { sharedSingleFileQuery } from '@/lib/supabase/supabaseQueries.ts'
import { useErrorStore } from '@/stores/errorStore.ts'
import { computed, ref } from 'vue'
import type { SharedFile } from '@/lib/supabase/supabaseQueryTypes.ts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, bytesToString, convertDateFromIso } from '@/lib/utils.ts'
import { Icon } from '@iconify/vue'
import { downloadSharedFile } from '@/lib/fileManager.ts'

const route = useRoute('/shared/[uuid]');
const file = ref<SharedFile | null>(null);

async function getFile() {
  const { data, error, status } = await sharedSingleFileQuery(route.params.uuid);
  if (error) useErrorStore().setError({ error, customCode: status });

  file.value = data;
}

await getFile();

const userFriendlyDate = computed(() => {
  if (!file.value) return
  return convertDateFromIso(file.value.created_at)
})

const userFriendlySize = computed(() => {
  if (!file.value) return
  return bytesToString(file.value.size ?? 10)
})

function download() {
  if (!file.value) return;
  downloadSharedFile(file.value.id);
}
</script>

<template>
  <div class="flex justify-center items-center">
    <Card v-if="file" :class="cn('w-[380px]', $attrs.class ?? '')">
      <CardHeader>
        <CardTitle>{{ file.name }}</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="flex items-center space-x-4 rounded-md border p-0">
          <div class="rounded-md bg-muted h-full w-full p-4 text-muted-foreground">Preview is not available</div>
        </div>
        <div>
          <div
            class="card-point"
          >
            <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                File size
              </p>
              <p class="text-sm text-muted-foreground">
                {{ userFriendlySize }}
              </p>
            </div>
          </div>

          <div
            class="card-point"
          >
            <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                Who has access
              </p>
              <p class="text-sm text-muted-foreground">
                Open access via link.
              </p>
            </div>
          </div>

          <div
            class="card-point"
          >
            <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                Created
              </p>
              <p class="text-sm text-muted-foreground">
                {{ userFriendlyDate }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="download">
          <Icon icon="akar-icons:cloud-download" />
          Download
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
.card-point {
  @apply mb-1 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-4 last:mb-0 last:pb-0;
}
</style>
