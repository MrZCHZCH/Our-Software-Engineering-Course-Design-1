<template>
  <div>
    <div v-if="loginState">
      <el-link type="primary">{{ nickname }}</el-link>
      <el-link type="primary" @click="logout">登出</el-link>
    </div>
    <div v-else>
      <el-link type="primary">登录</el-link>
      <el-link type="primary">注册</el-link>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import {getCookie, setCookie,delCookie} from "@/cookies"
export default {
  name: "LogInBar",
  setup(){
    const loginState = ref(false);
    const nickname = ref('');
    onMounted(() => {
      setCookie('userId','666666',10)
      console.log(getCookie('userId'))
      loginState.value=true
    });
    return{
      loginState,
      nickname
    }
  },
  methods:{
    logout(){
      delCookie('userId')
      location. reload()
    }
  }
}
</script>

<style scoped>

</style>