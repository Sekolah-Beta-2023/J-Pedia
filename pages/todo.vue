<template>
  <div class="container min-h-screen min-w-full mt-4">
    <div class="flex relative justify-between my-4 mx-6 min-w-fit">
      <span
        v-if="isLoading"
        class="iconify hidden text-md text-gray-700 mx-2 absolute animate-spin mt-3"
        data-icon="streamline:interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload"
      ></span>
      <input
        type="text"
        class="rounded-md p-2 pl-7 mr-3 text-black w-full"
        placeholder="Membuat Mie Ayam"
        v-model="getTitle"
      />
      <button
        :class="['p-2 rounded-md', onEdit ? 'bg-blue-500' : 'bg-green-500']"
        @click="onEdit ? updateTask() : insertTask()"
      >
        {{ onEdit ? 'Save' : 'Add' }}
      </button>
    </div>

    <div
      class="flex justify-between p-2 mt-2 bg-white mx-6 rounded-md"
      v-for="(task, index) in tasks"
      :key="index"
    >
      <div class="flex flex-col">
        <label
          for="default-checkbox"
          :class="[
            'ml-2 text-sm font-medium text-gray-900 items-center',
            task.isDone ? 'line-through italic' : '',
          ]"
          >{{ task.title }}</label
        >
      </div>
      <div>
        <button
          class="rounded-md bg-red-400 p-1 mr-1 text-sm"
          @click="deleteTask(task)"
        >
          DELETE
        </button>
        <button
          class="rounded-md bg-blue-400 p-1 text-sm"
          @click="editTask(task)"
        >
          EDIT
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  middleware: 'supabase-auth',
  data() {
    return {
      taskData: {
        title: '',
        isDone: null,
      },
      editedTask: null,
      onEdit: false,
    }
  },
  computed: {
    ...mapState('task', ['tasks', 'isLoading']),
    getTitle: {
      get() {
        if (this.onEdit) {
          return this.editedTask.title
        } else {
          return this.taskData.title
        }
      },
      set(val) {
        if (this.onEdit) {
          this.editedTask.title = val
        } else {
          this.taskData.title = val
        }
      },
    },
  },
  methods: {
    ...mapActions('task', [
      'fetchTasks',
      'insertTask',
      'updateTask',
      'deleteTask',
      'setupChannel',
    ]),
    ...mapMutations('task', ['SET_LOADING']),
    editTask(task) {
      this.onEdit = true
      this.editedTask = { ...task }
    },

    async fetchTask() {
      await this.$store.dispatch('task/fetchTasks')
    },

    insertTask() {
      this.$store.dispatch('task/insertTask', {
        title: this.taskData.title,
        isDone: false,
      })
      this.taskData.title = ''
    },

    async updateTask() {
      this.isLoading = true
      await this.$store.dispatch('task/updateTask', this.editedTask)
      console.log(this.editedTask)
      this.onEdit = false
      this.taskData.title = ''
    },

    async deleteTask(task) {
      await this.$store.dispatch('task/deleteTask', task)
    },

    async setupChannel() {
      await this.$store.dispatch('task/setupChannel')
    },
  },
  mounted() {
    this.fetchTask()
    this.setupChannel()
  },

  updated() {
    // this.isLoading = false
  },

  beforeDestroy() {},
}
</script>
