import {acceptHMRUpdate, defineStore} from "pinia";
import {ref} from "vue";
import type {Session, User} from "@supabase/supabase-js";
import type {Tables} from "@/types/database.types.ts";
import {profileQuery} from "@/lib/supabase/supabaseQueries.ts";
import {usePageStore} from "@/stores/pages.ts";
import {supabase} from "@/lib/supabase/supabaseClient.ts";


export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<null | User>(null);
  const profile = ref<null | Tables<'profiles'>>(null);
  const isTrackAuthChangesSet = ref(false);

  async function setProfile(){
    if (!user.value) {
      profile.value = null;
      return
    }
    if (!profile.value || profile.value.id !== user.value.id){
      const {data, error} = await profileQuery(user.value.id);
      profile.value = data || null;
    }
  }

  async function setAuth(session: null | Session = null){
    if (!session){
      user.value = null;
      profile.value = null;
      return
    }

    user.value = session.user;
    await setProfile();
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
    profile,
    setAuth,
    getSession,
    trackAuthChanges
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
