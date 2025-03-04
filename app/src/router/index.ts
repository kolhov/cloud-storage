import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from "@/stores/authStore.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.getSession();

  const isAuthRoute = ['/login', '/register'].includes(to.path);

  if (!authStore.user && !isAuthRoute){
    return {
      name: '/login'
    }
  }

  if (authStore.user && isAuthRoute){
    return {
      name: '/'
    }
  }
})

export default router
