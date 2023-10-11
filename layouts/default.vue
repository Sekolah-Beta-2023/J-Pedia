<template>
  <div id="app">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>
<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import supabase from '@/plugins/supabase.client'

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      authenticated: false,
      authListener: null,
    }
  },
  mounted() {
    const {
      data: { authListener },
    } = supabase.auth.onAuthStateChange(() => this.checkUser())
    const {} = supabase.auth.onAuthStateChange(() => this.checkUser())
    this.authListener = authListener
  },
  methods: {
    async checkUser() {
      const user = await supabase.auth.getUser()
      if (user) {
        this.authenticated = true
      } else {
        this.authenticated = false
      }
    },
  },
  beforeMount() {
    this.authListener?.unsubscribe()
  },
}
</script>
