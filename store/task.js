import supabase from '~/plugins/supabase.client'

export const state = () => ({
  tasks: [],
  isLoading: false,
})

export const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  SET_LOADING(state, value) {
    state.isLoading = value
  },
  ADD_TASK(state, newTask) {
    state.tasks.push(newTask)
  },
  DELETE_TASK(state, task) {
    state.tasks = state.tasks.filter((t) => t.id !== task.id)
  },
}

export const actions = {
  async fetchTasks({ commit }) {
    try {
      const {
        data: {
          user: { id },
        },
      } = await supabase.auth.getUser()

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', id)
      if (tasks) {
        commit('SET_TASKS', tasks)
      }
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },
  async insertTask({ commit }, taskData) {
    commit('SET_LOADING', true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    try {
      const { error } = await supabase.from('tasks').insert({
        title: taskData?.title,
        isDone: taskData?.isDone,
        email: user?.email,
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },

  async updateTask({ commit, dispatch }, updatedTask) {
    commit('SET_LOADING', true)
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', updatedTask.id)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },

  async deleteTask({ commit }, task) {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', task.id)
      commit('DELETE_TASK', task)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },

  async toggleStatus({ commit }, task) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          isDone: task?.isDone,
        })
        .eq('id', task?.id)
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  },

  setupChannel({ commit, state, dispatch }) {
    const commonChanges = supabase
      .channel('new-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (event) => {
          if (event.new) {
            commit('SET_TASKS', [...state.tasks, event.new])
            dispatch('fetchTasks')
          }
        }
      )
      .subscribe()
    const onInsert = supabase
      .channel('insert-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
        },
        (event) => {
          const { new: insertTask } = event
          commit('SET_TASKS', [...state.tasks, insertTask])
        }
      )
      .subscribe()

    const onUpdate = supabase
      .channel('update-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
        },
        (event) => {
          const { new: updateTask } = event
          commit('SET_TASKS', [...state.tasks, updateTask])
        }
      )
      .subscribe()

    const onDelete = supabase
      .channel('delete-channel')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'tasks',
        },
        (e) => {
          dispatch('fetchTasks')
        }
      )
      .subscribe()
  },
}
