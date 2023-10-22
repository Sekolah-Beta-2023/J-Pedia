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
  ADD_DATA(state, newData) {
    const isExist = state.userData.some(
      (existData) => existData.id === state.userData.id
    )
    if (!isExist) {
      state.userData.push(newData)
    }
  },
}

export const actions = {
  async fetchUser({ commit, state, dispatch }) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (user) {
        const isDataExist = state.userData.find(
          (existingUser) => existingUser.id === user.id
        )

        if (!isDataExist) {
          const updatedUserData = [...state.userData, user]
          commit('SET_DATA', updatedUserData)
        }
        dispatch('getPublicUrl')
        commit('SET_AUTH', true)
      }
      if (error) throw error
    } catch (error) {
      commit('SET_AUTH', false)
    }
  },

  async getPublicUrl({ commit, state }) {
    try {
      const { data } = await supabase.storage
        .from('avatar')
        .list(`${state.userData[0].id}`)
      if (data.length >= 2) {
        const { data, error } = supabase.storage
          .from('avatar')
          .getPublicUrl(`${state.userData[0].id}/profile.jpg`)
        if (data) {
          commit('ADD_DATA', data)
        }
        if (error) throw error
      }
    } catch (error) {
      console.error(error)
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
