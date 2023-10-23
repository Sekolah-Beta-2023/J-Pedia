import supabase from '~/plugins/supabase.client'

export const state = () => ({
  userData: [],
  isAuth: null,
  onEdit: false,
  avatar_default: 'https://placehold.co/400',
})

export const mutations = {
  SET_DATA(state, userData) {
    state.userData = userData
  },

  SET_AUTH(state, value) {
    state.isAuth = value
  },

  SET_EDIT(state, value) {
    state.onEdit = value
  },

  ADD_DATA(state, newData) {
    const isExist = state.userData.some(
      (existData) => existData.id === state.userData.id
    )
    if (!isExist) {
      state.userData.push(newData)
    }
  },

  DELETE_INDEKS(state) {
    state.userData.splice(1, 1)
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
        .list(`${state.userData[0].id}`, {
          search: 'profile.jpg',
        })
      // console.log(data)
      if (data.length >= 1) {
        const { data, error } = supabase.storage
          .from('avatar')
          .getPublicUrl(`${state.userData[0].id}/profile.jpg`)
        if (data) {
          commit('ADD_DATA', data)
          commit('SET_EDIT', false)
        }
        if (error) throw error
      }
    } catch (error) {
      console.error(error)
    }
  },

  async avatarUpload({ dispatch, state }, file) {
    try {
      const { data, error } = await supabase.storage
        .from('avatar')
        .upload(`${state.userData[0].id}/profile.jpg`, file, {
          cacheControl: '3600',
          upsert: true,
        })
      if (data) {
        console.log(data)
        dispatch('getPublicUrl')
      }
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },

  async deleteAvatar({ commit, state }) {
    try {
      const { error } = await supabase.storage
        .from('avatar')
        .remove(`${state.userData[0].id}/profile.jpg`)
      commit('SET_EDIT', false)
      commit('DELETE_INDEKS')
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },
}
