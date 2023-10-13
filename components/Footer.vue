<template>
  <footer
    class="flex flex-col items-center gap-3 bg-gradient-to-t from-green-400 to-transparent to-90% py-10 text-center"
  >
    <div class="flex gap-4 my-3">
      <a href="/" class="text-2xl"
        ><span><Icon icon="uil:youtube"></Icon></span
      ></a>
      <a href="https://github.com/CallMeJaja" class="text-2xl"
        ><Icon icon="uil:github"></Icon
      ></a>
      <a href="https://instagram.com/rzae.id" class="text-2xl"
        ><Icon icon="uil:instagram"></Icon
      ></a>
    </div>
    <p class="text-xs">Copyright &#169; 2023 J-Pedia</p>
  </footer>
</template>
<script>
import { Icon } from '@iconify/vue2'
export default {
  components: {
    Icon,
  },
}
</script>
