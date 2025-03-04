<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {Button} from "@/components/ui/button";
import {ref} from "vue";

const props = defineProps<{
  message: string,
  customCode: number,
  statusCode: number,
  isErrorCustom: boolean
}>()

const error = ref({
  code: 500,
  msg: "Ops, something went wrong!"
})

if (props.isErrorCustom){
  error.value.code = props.customCode;
  error.value.msg = props.message;
}

if (props.statusCode === 406){
  error.value.code = 404;
  error.value.msg = 'Page not found';
}

</script>

<template>
  <div>
    <icon icon="lucide:triangle-alert" class="error__icon text-center w-full" />
    <h1 class="error__code">{{ error.code }}</h1>
    <p class="error__msg">{{ error.msg }}</p>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> Back to homepage </Button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>
