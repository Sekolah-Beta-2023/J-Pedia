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
      >
      </span>
    </button>

    <!-- CHART MENU -->
    <div
      ref="chartMenu"
      :class="{ 'translate-x-0 mr-5': chartNav, 'translate-x-full': !chartNav }"
      class="fixed inset-y-0 right-0 w-60 h-1/2 mt-20 bg-gray-800 rounded-md navbar-menu transition-transform duration-500 ease-in-out z-50"
    >
      <div class="flex flex-col">
        <h1 class="my-2 mx-2">Hello World</h1>
        <!-- TODO : Buat Card Product -->
      </div>
    </div>
    <!-- CHART END -->

    <!-- NAV MENU -->
    <div
      :class="{
        'translate-x-0': hamburgerNav,
        '-translate-x-full': !hamburgerNav,
      }"
      class="fixed inset-y-0 left-0 w-full lg:w-1/4 h-auto bg-gray-800 navbar-menu transition-transform duration-500 ease-in-out z-50"
    >
      <div class="flex justify-between mx-4 my-3">
        <h1 class="navbar-menu text-3xl">
          J<span class="text-green-400">P</span
          ><span class="font-semibold text-lg text-green-400 tracking-widest"
            >edia</span
          >
        </h1>
        <div>
          <button
            class="rounded-full transition-opacity opacity-70 hover:opacity-100 ring-offset-green-500 focus:outline-none focus:ring-1 focus:ring-offset-1"
            @click="toggleHamburgerNav"
          >
            <span
              class="iconify"
              data-icon="bi:x"
              style="color: white; font-size: 20px"
            ></span>
          </button>
        </div>
      </div>
      <!-- TODO : Buat Isi Menu -->
      <div class="flex flex-col mx-5">
        <nuxt-link
          @click.native="toggleHamburgerNav"
          to="/"
          class="mb-2 font-semibold"
          >Home</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/todo" class="mb-2"
          >Todo</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/" class="mb-2"
          >About</nuxt-link
        >
        <nuxt-link @click.native="toggleHamburgerNav" to="/" class="mb-2"
          >Contact</nuxt-link
        >
      </div>
      <div
        class="flex flex-col bottom-0 items-center justify-center absolute w-full"
      >
        <hr class="border-t-2 justify-center items-center w-10/12 opacity-20" />
        <nuxt-link
          to="/profile"
          v-if="isAuth"
          class="p-5 bg-transparent hover:bg-gray-500 w-10/12 mx-5 mt-3 justify-center items-center text-center font-medium rounded-md"
          @click.native="toggleHamburgerNav()"
        >
          <div class="flex gap-2">
            <img
              :src="
                userData[1]?.publicUrl ||
                userData[0]?.user_metadata?.avatar_url ||
                avatar_default
              "
              class="rounded-full h-12 w-12"
              :alt="userData[0]?.user_metadata?.full_name"
            />
            <div class="flex flex-col break-all">
              <h4 class="text-left font-semibold text-md leading-normal">
                {{ userData[0]?.user_metadata?.full_name }}
              </h4>
              <h6 class="text-left text-sm">
                {{
                  userData[0]?.user_metadata?.preferred_username ||
                  userData[0]?.user_metadata?.email
                }}
                <!-- rezaasriano193333333@gmail.casdsom -->
              </h6>
            </div>
          </div>
        </nuxt-link>
        <button
          v-if="isAuth"
          @click="logout()"
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
import { mapState, mapActions } from 'vuex'
import Iconify from '@iconify/iconify'
import supabase from '~/plugins/supabase.client'

export default {
  data() {
    return {
      hamburgerNav: false,
      chartNav: false,
    }
  },
  computed: {
    ...mapState(['userData', 'isAuth', 'avatar_default']),
  },

  methods: {
    ...mapActions(['fetchUser']),
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

    async logout() {
      this.hamburgerNav = false
      await supabase.auth.signOut({
        scope: 'local',
      })
    },

    fetchUser() {
      this.$store.dispatch('fetchUser')
    },
  },

  fetch() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session !== null) {
        this.fetchUser()
      }
    })
  },

  updated() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.$store.commit('SET_AUTH', false)
        this.$router.push('/auth/login')
      }
    })
  },
}
</script>

<style scoped>
.container .navbar-menu {
  transition: transform 0.5s ease-in-out;
}
</style>
