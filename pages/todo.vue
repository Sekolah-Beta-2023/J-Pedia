<template>
  <div class="min-h-screen w-full mt-4">
    <div class="flex justify-center items-centers">
      <div class="flex justify-between" v-if="!onEdit">
        <div class="relative">
          <input
            type="text"
            placeholder="Makan siang"
            class="mr-3 rounded-md p-2 pl-8 text-black"
            v-model="tasks.title"
          />
          <div v-if="onInsertTask" class="absolute left-0 top-3">
            <!-- Tambahkan elemen ikon loading di sini -->
            <span
              class="iconify text-lg font-semibold text-gray-700 mx-2 animate-spin"
              data-icon="streamline:interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload"
            ></span>
          </div>
        </div>
        <button class="bg-green-400 p-2 rounded-md" @click="insertTask()">
          Add
        </button>
      </div>
      <div class="flex justify-between" v-else>
        <div class="relative">
          <input
            type="text"
            class="mr-3 rounded-md p-2 pl-8 text-black"
            v-model="editedTask.title"
          />
          <div v-if="onInsertTask" class="absolute left-0 top-3">
            <!-- Tambahkan elemen ikon loading di sini -->
            <span
              class="iconify text-lg font-semibold text-gray-700 mx-2 animate-spin"
              data-icon="streamline:interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload"
            ></span>
          </div>
          <button class="bg-blue-400 p-2 rounded-md" @click="updateTask()">
            Save
          </button>
        </div>
      </div>
    </div>
    <div
      class="flex justify-between p-2 mt-2 bg-white mx-20 rounded-md"
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
      onInsertTask: false,
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
      this.onInsertTask = true
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
      this.onInsertTask = true
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: this.editedTask?.title,
            isDone: this.editedTask?.isDone,
          })
          .eq('id', this.editedTask.id)
        if (data) {
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
    async toggleStatus(task) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            isDone: task.isDone,
          })
          .eq('id', task.id)
        if (data) {
          console.log(data)
        }
        if (error) throw error
      } catch (error) {
        console.log(error)
      }
    },
    editTask(task) {
      this.onEdit = true
      this.editedTask = { ...task }
    },

    channel() {
      supabase
        .channel('my_new_channel_for_todo')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
          },
          (event) => {
            const { new: newTask } = event
            this.tasks = this.tasks.map((task) => {
              if (task.id === newTask.id) {
                return {
                  ...task,
                  ...newTask,
                }
              }
              return task
            })
          }
        )
        .subscribe()
    },
    onDelete() {
      supabase
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
            this.tasks = this.tasks.filter((task) => task.id !== deletedTaskId)
          }
        )
        .subscribe()
    },
    onInsert() {
      supabase
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
            this.tasks.push(updateTask)
            this.onInsertTask = false
          }
        )
        .subscribe()
    },
    onUpdate() {
      supabase
        .channel('update-channel')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'tasks',
          },
          (event) => {
            this.onInsertTask = false
          }
        )
        .subscribe()
    },
  },
  mounted() {
    this.fetchTask()
    this.channel()
    this.onDelete()
    this.onInsert()
    this.onUpdate()
  },
}
</script>
