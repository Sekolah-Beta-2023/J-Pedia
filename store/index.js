import { comment } from 'postcss'
import supabase from '~/plugins/supabase.client'

export const state = () => ({
  userData: [],
  isAuth: null,
  avatarData: [],
})

export const mutations = {
  SET_DATA(state, userData) {
    state.userData = userData
  },
  SET_AUTH(state, value) {
    state.isAuth = value
  },

  SET_AVATAR(state, avatarData) {
    state.avatarData = avatarData
  },
}

export const actions = {
  async fetchUser({ commit }) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (user.user_metadata) {
        commit('SET_DATA', user.user_metadata)
        commit('SET_AUTH', true)
      }
      if (error) throw error
    } catch (error) {
      commit('SET_AUTH', false)
    }
  },

  async createAvatar({ commit, state }) {
    try {
      const { data, error } = await supabase.storage.from('avatar').list()
      if (data) {
        commit('SET_AVATAR', data[1])
      }
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },
}
