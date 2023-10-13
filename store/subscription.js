const { default: supabase } = require('~/plugins/supabase.client')

const state = {
  tasks: [],
  onInsertTask: false,
  editedTask: null,
}

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  SET_ON_INSERT_TASK(state, value) {
    state.onInsertTask = value
  },
  SET_EDITED_TASK(state, value) {
    state.editedTask = value
  },
}

const actions = {
  setupChannel({ commit, state }) {
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
          const { new: updateTask } = event
          commit('SET_TASKS', [...state.tasks, updateTask])
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
          commit('SET_ON_INSERT_TASK', false)
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
        (event) => {
          const deletedTaskId = event.old.id
          state.tasks = state.tasks.filter((task) => task.id !== deletedTaskId)
        }
      )
      .subscribe()
  },
}

export default {
  state,
  mutations,
  actions,
}
