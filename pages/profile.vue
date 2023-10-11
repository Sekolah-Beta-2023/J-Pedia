<template>
  <div class="min-h-screen mx-6">
    <div class="flex flex-col border rounded gap-12 pl-8">
      <img
        :src="userData.avatar"
        :alt="userData.full_name"
        class="rounded-full w-12 h-12 items-center"
      />
      <p>Nama : {{ userData.full_name }}</p>
      <p>Email : {{ userData.email }}</p>
      <p>Username : {{ userData?.username_gh }}</p>
    </div>
  </div>
</template>
<script>
export default {
  middleware: 'supabase-auth',
  data() {
    return {
      userData: {
        full_name: '',
        avatar: '',
        email: '',
        username_gh: '',
      },
    }
  },
  methods: {
    getData() {
      if (localStorage.getItem('data_jpedia')) {
        const dataLocal = localStorage.getItem('data_jpedia')
        const data = JSON.parse(dataLocal)
        this.userData.full_name = data.user_metadata.full_name
        this.userData.email = data.user_metadata.email
        this.userData.avatar = data.user_metadata.avatar_url
        this.userData.username_gh = data.user_metadata?.preferred_username
      } else {
        alert('Data masih kosong')
      }
    },
  },
  mounted() {
    this.getData()
  },
}
</script>
