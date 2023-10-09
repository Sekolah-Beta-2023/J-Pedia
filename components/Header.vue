<template>
  <div class="container">
    <button
      class="p-1 px-2 mx-6 my-6 rounded bg-green-400 hover:opacity-90 active:overflow-hidden"
      @click="toggleHamburgerNav"
    >
      <span
        class="iconify"
        :class="{ hidden: hamburgerNav, block: !hamburgerNav }"
        data-icon="uis:align-left"
        style="color: white; font-size: 24px"
      ></span>
      <span
        class="iconify"
        :class="{ hidden: !hamburgerNav, block: hamburgerNav }"
        data-icon="bx:bx-x"
        style="color: white; font-size: 24px"
      ></span>
    </button>

    <!-- CHART BUTTON -->
    <button
      v-if="isAuth"
      class="p-1 px-2 rounded absolute right-0 mx-6 my-6 bg-green-400"
      @click="chartNav = !chartNav"
    >
      <span
        class="iconify"
        data-icon="uil:shopping-cart"
        style="font-size: 24px"
      ></span>
    </button>

    <!-- CHART MENU -->
    <div
      ref="chartMenu"
      :class="{ 'translate-x-0 mr-5': chartNav, 'translate-x-full': !chartNav }"
      class="fixed inset-y-0 right-0 w-60 h-1/2 mt-20 bg-gray-800 rounded-md navbar-menu transition-transform duration-500 ease-in-out"
    >
      <h1 class="my-2 mx-2">Hello World</h1>
      <!-- TODO : Buat Card Product -->
    </div>
    <!-- CHART END -->

    <!-- NAV MENU -->
    <div
      :class="{
        'translate-x-0': hamburgerNav,
        '-translate-x-full': !hamburgerNav,
      }"
      class="fixed inset-y-0 left-0 w-full min-h-screen bg-gray-800 navbar-menu transition-transform duration-500 ease-in-out"
    >
      <button
        class="p-1 mx-3 my-3 rounded-sm transition-opacity opacity-70 hover:opacity-100 absolute right-0 top-0 ring-offset-green-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        @click="toggleHamburgerNav"
      >
        <span
          class="iconify"
          data-icon="bi:x"
          style="color: white; font-size: 20px"
        ></span>
      </button>
      <h1 class="navbar-menu p-4 text-3xl">
        J<span class="font-semibold text-lg text-green-400 tracking-widest"
          >Pedia</span
        >
      </h1>
      <!-- TODO : Buat Isi Menu -->
      <div class="flex flex-col mx-5">
        <nuxt-link
          @click.native="toggleHamburgerNav"
          to="/"
          class="mb-2 font-semibold"
          >Home</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/" class="mb-2"
          >Product</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/" class="mb-2"
          >About</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/" class="mb-2"
          >Contact</nuxt-link
        >
      </div>
      <div
        class="flex flex-col bottom-0 mb-10 items-center justify-center absolute w-full"
      >
        <hr class="border-t-2 justify-center items-center w-10/12 opacity-20" />
        <button
          v-if="isAuth"
          class="p-5 bg-transparent hover:bg-gray-500 w-10/12 mx-5 mt-3 mb-3 justify-center items-center text-center font-medium rounded-md"
        >
          <div class="flex">
            <img
              :src="avatar"
              class="rounded-full h-12 w-12"
              :alt="full_name"
            />
            <div class="flex flex-col mx-4">
              <p class="text-left text-lg leading-normal">{{ full_name }}</p>
              <p class="text-sm text-left">{{ email || username_gh }}</p>
            </div>
          </div>
        </button>
        <button
          v-if="isAuth"
          @click="logout"
          class="p-1 bg-red-400 w-10/12 mx-5 mt-3 mb-5 justify-center items-center text-center font-medium rounded-md"
        >
          Logout
        </button>
        <nuxt-link
          v-else
          @click.native="toggleHamburgerNav"
          to="/auth/login"
          class="p-1 bg-green-400 w-10/12 mx-5 mb-5 mt-3 justify-center items-center text-center font-medium rounded-md"
        >
          Login
        </nuxt-link>
      </div>
    </div>
    <!-- NAV END -->
  </div>
</template>

<script>
import Iconify from '@iconify/iconify'
import { createClient } from '@supabase/supabase-js'
export default {
  components: {
    Iconify,
  },
  data() {
    const supabase = createClient(this.$config.baseURL, this.$config.apiKey)
    return {
      hamburgerNav: false,
      chartNav: false,
      authStatus: false,
      avatar: '',
      email: '',
      full_name: '',
      username_gh: '',
      isAuth: false,
      supabase,
    }
  },
  mounted() {
    if (this.supabase.auth.getSession) {
      this.loadData()
    }
  },
  methods: {
    toggleHamburgerNav() {
      this.hamburgerNav = !this.hamburgerNav
      if (this.chartNav) {
        this.chartNav = false
      }
      if (this.hamburgerNav) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
    },

    toggleChartNav() {
      this.chartNav = !this.chartNav
    },

    handleClickOutsideChartMenu(event) {
      if (this.chartNav) {
        const chartMenu = this.$refs.chartMenu
        if (!chartMenu.contains(event.target)) {
          this.chartNav = false
        }
      }
    },
    async logout() {
      const { data, error } = await this.supabase.auth.signOut({
        scope: 'local',
      })
      this.isAuth = false
      this.hamburgerNav = false
    },

    async loadData() {
      this.isAuth = true
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (user.app_metadata.provider === 'google') {
        const metadata = user.user_metadata
        this.avatar = metadata.avatar_url
        this.full_name = metadata.full_name
        this.email = metadata.email
      } else if (user.app_metadata.provider === 'github') {
        // Jika Login pake Github
        const metadata = user.user_metadata
        this.avatar = metadata.avatar_url
        this.full_name = metadata.full_name
        this.username_gh = metadata.preferred_username
      }
    },
  },
}
</script>

<style scoped>
.container .navbar-menu {
  transition: transform 0.5s ease-in-out;
}
</style>
