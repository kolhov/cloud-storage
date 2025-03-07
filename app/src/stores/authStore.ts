import {acceptHMRUpdate, defineStore} from "pinia";
import {ref} from "vue";
import type {Session, User} from "@supabase/supabase-js";
import {supabase} from "@/lib/supabase/supabaseClient.ts";

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<null | User>(null);
  const isTrackAuthChangesSet = ref(false);

  async function setAuth(session: null | Session = null){
    if (!session){
      user.value = null;
      return
    }

    user.value = session.user;
  }

  async function getSession(){
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) await setAuth(data.session);
  }

  async function trackAuthChanges(){
    if (isTrackAuthChangesSet.value) return;

    isTrackAuthChangesSet.value = true;
    supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setAuth(session);
      }, 0)
    })
  }

  return {
    user,
    setAuth,
    getSession,
    trackAuthChanges
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
