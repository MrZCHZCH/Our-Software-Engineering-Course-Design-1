<template>
  <div>
    <div v-if="loginState">
      欢迎，{{ nickname }}
      <el-button type="primary" @click="logout">登出</el-button>
    </div>
    <div v-else>
      <el-link type="primary">登录</el-link>
      <el-link type="primary">注册</el-link>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import {delCookie, getCookie, setCookie} from "@/cookies"
import axios from "axios";

export default {
  name: "LogInBar",
  setup() {
    const loginState = ref(false);
    const nickname = ref('');
    onMounted(() => {
      setCookie('userId', '666666', 10)
      console.log(getCookie('userId'))
      loginState.value = true
    });
    return {
      loginState,
      nickname
    }
  },
  methods: {
    logout() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/index/logout', {}).then(res => {
          if (res.data.respCode == 200) {
            delCookie('userId')
            location.reload()
          }
        });
      });
    }
  }
}
</script>

<style scoped>

</style>