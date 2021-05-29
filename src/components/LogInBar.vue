<template>
  <div>
    <el-menu v-if="!app.loginState" default-active="1" mode="horizontal" style="font-weight: bold">
      <el-menu-item index="1">软工车队课设</el-menu-item>
      <el-menu-item style="float: right" @click="drawer_register = true">注册</el-menu-item>
      <el-menu-item style="float: right" @click="drawer_login = true">登录</el-menu-item>
    </el-menu>
    <el-menu v-else default-active="1" mode="horizontal" style="font-weight: bold">
      <el-menu-item index="1">软工车队课设</el-menu-item>
      <el-menu-item style="float: right" @click="logout">登出</el-menu-item>
      <el-menu-item style="float: right">欢迎，{{ app.nickname }}</el-menu-item>
    </el-menu>
  </div>
  <el-drawer v-model="drawer_login" :direction="direction" title="登录">
    <log-in-page style="padding-left: 15px" @success="loginSuccess"/>
  </el-drawer>
  <el-drawer v-model="drawer_register" :direction="direction" title="注册">
    <register-page style="padding-left: 15px" @success="registerSuccess"/>
  </el-drawer>
</template>

<script>
import {ref} from 'vue';
//import {delCookie} from "@/cookies"
import axios from "axios";
import LogInPage from "@/components/LogInPage";
import RegisterPage from "@/components/RegisterPage";

export default {
  name: "LogInBar",
  components: {RegisterPage, LogInPage},
  inject:['app'],
  setup() {
    return {
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
            //delCookie('userId')
            let data = {
              loginState: false,
              mytype: -1,
              userId: -1,
              nickname: ''
            }
            this.app.setLogin(data)
          }
        });
      });
    },
    loginSuccess(data) {
      this.drawer_login = false
      this.app.setLogin(data)
    },
    registerSuccess() {
      this.drawer_register = false
    }
  }
}
</script>

<style scoped>

</style>