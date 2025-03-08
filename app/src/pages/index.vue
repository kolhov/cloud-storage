<script setup lang="ts">
import {usePageStore} from "@/stores/pages.ts";
import { useRouter } from 'vue-router'

usePageStore().pageData.title = 'Homepage';

//there must be some preview page until then redirect
useRouter().push('/home')
</script>

<template>

</template>

<style scoped>

</style>
