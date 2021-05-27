<template>
  <div>
      <el-menu mode="horizontal" v-if="!loginState" default-active="1" style="font-weight: bold">
        <el-menu-item index="1">软工车队课设</el-menu-item>
        <el-menu-item style="float: right" @click="drawer_register = true">注册</el-menu-item>
        <el-menu-item style="float: right" @click="drawer_login = true">登录</el-menu-item>
      </el-menu>
    <el-menu mode="horizontal" v-else default-active="1" style="font-weight: bold">
        <el-menu-item index="1">软工车队课设</el-menu-item>
        <el-menu-item style="float: right" @click="logout">登出</el-menu-item>
        <el-menu-item style="float: right">欢迎，{{ nickname }}</el-menu-item>
      </el-menu>
  </div>
  <el-drawer title="登录" v-model="drawer_login" :direction="direction">
    <log-in-page style="padding-left: 15px"/>
  </el-drawer>
  <el-drawer title="注册" v-model="drawer_register" :direction="direction">
    <register-page style="padding-left: 15px"/>
  </el-drawer>
</template>

<script>
import {onMounted, ref} from 'vue';
import {delCookie, getCookie, setCookie} from "@/cookies"
import axios from "axios";
import LogInPage from "@/components/LogInPage";
import RegisterPage from "@/components/RegisterPage";

export default {
  name: "LogInBar",
  components: {RegisterPage, LogInPage},
  setup() {
    const loginState = ref(false);
    const nickname = ref('');
    onMounted(() => {
      setCookie('userId', '666666', 10)
      console.log(getCookie('userId'))
      //loginState.value = true
    });
    return {
      loginState,
      nickname,
      drawer_login: ref(false),
      drawer_register: ref(false),
      direction: ref('rtl')
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