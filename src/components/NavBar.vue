<template>
  <div id="navbar">
    <div>
      <el-menu v-if="!app.loginState" default-active="1" mode="horizontal" style="font-weight: bold">
        <el-menu-item index="1">软工车队课设</el-menu-item>
        <el-menu-item style="float: right" @click="dialog_register = true">注册</el-menu-item>
        <el-menu-item style="float: right" @click="dialog_login = true">登录</el-menu-item>
      </el-menu>
      <el-menu v-else default-active="1" mode="horizontal" style="font-weight: bold">
        <el-menu-item index="1">软工车队课设</el-menu-item>
        <el-menu-item style="float: right" @click="logout">登出</el-menu-item>
        <el-menu-item style="float: right">欢迎，{{ app.nickname }}</el-menu-item>
      </el-menu>
    </div>
    <el-dialog v-model="dialog_login" center title="登录" width="600px">
      <log-in-page @success="loginSuccess"/>
    </el-dialog>
    <el-dialog v-model="dialog_register" center title="注册" width="600px">
      <register-page @success="registerSuccess"/>
    </el-dialog>
  </div>
</template>

<script>
import {inject, onMounted, ref} from 'vue';
import {delCookie, getCookie} from "@/cookies"
import axios from "axios";
import LogInPage from "@/components/LogInPage";
import RegisterPage from "@/components/RegisterPage";

export default {
  name: "NavBar",
  components: {RegisterPage, LogInPage},
  inject: ['app'],
  setup() {
    const app = inject('app')
    onMounted(() => {
      if (getCookie('token')) {
        axios.get('/index/getUser', {
          params: {token: getCookie('token')}
        }).then(res => {
          if (res.data.userId) {
            res.data.loginState = true
            app.setLogin(res.data)
          } else
            delCookie('token')
        });
      }
    })
    return {
      dialog_login: ref(false),
      dialog_register: ref(false),
      app
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
            delCookie('token')
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
      this.dialog_login = false
      this.app.setLogin(data)
    },
    registerSuccess() {
      this.dialog_register = false
      this.dialog_login = true
    }
  }
}
</script>

<style>
.el-menu-item {
  font-size: large !important;
}

#navbar {
  margin-bottom: 5px;
}
</style>