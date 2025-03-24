<script setup lang="ts">
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'

const props = defineProps<{
  name: string,
}>();

const emits = defineEmits<{
  sendName: [string]
}>();

const newName = ref<string>(props.name);

function sendName(){
  emits('sendName', newName.value);
}
</script>

<template>
  <DialogHeader>
    <DialogTitle>Create new folder</DialogTitle>
    <DialogDescription>
      Write the name. Click save when you're done.
    </DialogDescription>
  </DialogHeader>
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">
      Name
    </Label>
    <Input id="name" class="col-span-3" v-model="newName" />
  </div>
  <DialogFooter class="justify-end">
    <DialogClose as-child>
      <Button @click="sendName">
        Save
      </Button>
    </DialogClose>
  </DialogFooter>
</template>

<style scoped>

</style>
