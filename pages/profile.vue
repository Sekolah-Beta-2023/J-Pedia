<template>
  <div class="container min-h-screen min-w-full mt-6">
    <div v-if="!onEdit" class="flex flex-col gap-4 mx-4 min-w-fit">
      <div class="flex gap-5">
        <img
          :src="userData?.avatar_url"
          :alt="userData?.full_name"
          class="w-16 h-16 rounded-full"
        />
        <div class="flex flex-col justify-center">
          <h2>{{ userData?.full_name }}</h2>
          <h4>{{ userData?.email }}</h4>
        </div>
      </div>
      <button
        class="bg-green-500 p-1 rounded-md hover:opacity-90"
        @click="onEdit = !onEdit"
      >
        Edit Profile
      </button>
      <hr class="border-t border-gray-500 mx-1 my-5 min-w-fit" />
    </div>
    <div v-else class="flex flex-col gap-4 mx-4 min-w-fix">
      <div class="flex gap-5">
        <img
          :src="userData?.avatar_url"
          :alt="userData?.full_name"
          class="w-16 h-16 rounded-full"
        />
        <div class="flex flex-col justify-center">
          <input
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-gray-500 hover:file:bg-violet-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  middleware: 'supabase-auth',
  data() {
    return {
      onEdit: false,
    }
  },
  computed: {
    ...mapState(['userData', 'avatarData']),
  },
  methods: {
    ...mapActions(['fetchUser', 'createAvatar']),
    fetchUser() {
      this.$store.dispatch('fetchUser')
    },

    createAvatar() {
      this.$store.dispatch('createAvatar')
    },
  },
  mounted() {
    this.fetchUser()
    this.createAvatar()
  },
}
</script>
