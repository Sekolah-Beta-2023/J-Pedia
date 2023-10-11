<template>
  <div class="min-h-screen mt-4 m-5">
    <div class="flex justify-center items-center">
      <div class="flex justify-between" v-if="!onEdit">
        <input
          type="text"
          placeholder="isi todo..."
          class="mr-3 rounded-md p-1 text-black"
          v-model="tasks.title"
        />
        <button class="bg-green-400 p-1 rounded-md" @click="insertTask()">
          Add
        </button>
      </div>
      <div class="flex justify-between" v-else>
        <input
          type="text"
          class="mr-3 rounded-md p-1 text-black"
          v-model="editedTask.title"
        />
        <button class="bg-blue-400 p-1 rounded-md" @click="updateTask()">
          Save
        </button>
      </div>
    </div>
    <div
      class="flex justify-between m-1 mt-10"
      v-for="(task, index) in tasks"
      :key="index"
    >
      <div class="flex flex-col">
        <input
          :checked="task.isDone"
          v-model="task.isDone"
          id="default-checkbox"
          type="checkbox"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          @change="toggleStatus()"
        />
        <label
          for="default-checkbox"
          :class="[
            'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300',
            task.isDone ? 'line-through italic' : '',
          ]"
          >{{ task.title }}</label
        >
      </div>
      <div>
        <button
          class="rounded-md bg-red-400 p-1 text-sm"
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
import supabase from '~/plugins/supabase.client'
export default {
  middleware: 'supabase-auth',
  data() {
    return {
      tasks: [],
      onEdit: false,
      editedTask: null,
    }
  },
  methods: {
    async fetchTask() {
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
          console.log(tasks)
          this.tasks = tasks
        }
        if (error) throw error
      } catch (error) {
        console.error(error)
      }
    },
    async insertTask() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      try {
        const { data, error } = await supabase.from('tasks').insert({
          title: this.tasks.title,
          isDone: this.tasks.isDone,
          email: user.email,
        })
        if (data) {
          console.log(data)
        }
        if (error) throw error
      } catch (error) {
        console.log(error)
      }
    },
    async updateTask() {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: this.editedTask.title,
          })
          .eq('id', this.editedTask.id)
        if (data) {
          console.log(data)
          this.onEdit = false
        }
        if (error) throw error
      } catch (error) {
        console.log(error)
      }
    },
    async deleteTask(task) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task.id)
        if (data) {
          console.log(data)
          const index = this.tasks.indexOf(task)
          if (index > -1) {
            this.tasks.splice(index, 1)
          }
        }
        if (error) throw error
      } catch (error) {
        console.error(error)
      }
    },
    toggleStatus() {
      if (this.isDone) {
        this.isDone = false
      } else {
        this.isDone = true
      }
    },
    editTask(task) {
      this.onEdit = true
      this.editedTask = { ...task }
    },
  },
  mounted() {
    this.fetchTask()
  },
}
</script>
