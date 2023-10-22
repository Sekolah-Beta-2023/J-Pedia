<template>
  <main
    class="container min-h-screen min-w-full lg:min-w-full text-white mt-10"
  >
    <div class="items-center">
      <div
        class="flex flex-col gap-12 rounded-md border border-opacity-20 border-gray-100 p-8 m-4 mx-6"
      >
        <h1 class="text-center text-3xl font-semibold">Login Bro 😎</h1>
        <div class="items-center">
          <div class="flex flex-col">
            <button
              @click="signGoogle"
              class="bg-white text-black text-center rounded p-3 hover:opacity-95"
            >
              <span>
                <Icon icon="logos:google-icon" class="inline h-6 mx-1 w-5" />
                Masuk dengan Google
              </span>
            </button>
          </div>
          <div class="my-4 flex items-center">
            <hr class="flex-grow border-t border-gray-500 mx-4" />
            <span class="text-gray-500">Atau</span>
            <hr class="flex-grow border-t border-gray-500 mx-4" />
          </div>
          <div class="flex flex-col">
            <button
              @click="signGithub"
              class="bg-gray-800 text-white text-center rounded p-3 hover:opacity-90"
            >
              <span>
                <Icon icon="uil:github" class="inline h-6 mx-1 w-5" />
                Masuk dengan Github
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { Icon } from '@iconify/vue2'
import Iconify from '@iconify/iconify'
import supabase from '~/plugins/supabase.client'
export default {
  components: { Icon, Iconify },
  data() {
    return {}
  },
  computed: {},
  methods: {
    async signGoogle() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
    },

    async signGithub() {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: '/',
        },
      })
    },
  },
}
</script>
