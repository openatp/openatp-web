<template>
  <div class="text-center mt-2.5">
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {useRouter} from "vue-router"

export default defineComponent({
  name: "Login",
  setup: () => {
    const router = useRouter()

    function login() {
      router.push("/project")
    }

    return {
      login
    }
  }
})
</script>

<style scoped>

</style>
