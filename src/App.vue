<template>
  <log-in-bar :login-state="loginState" :nickname="nickname" @getInfo="getLogin"/>
  <el-row>
    <el-col :span="18">
      <Editor :user-id="1" :user-type="1"/>
    </el-col>
    <el-col :span="6">
      <EListPage :login-state="loginState" :user-id="userId" :user-type="userType" @setExeId="getExeId"/>
    </el-col>
  </el-row>
</template>

<script>

import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
import LogInBar from "@/components/LogInBar";
import {ref} from "vue";

export default {
  name: 'App',
  components: {
    LogInBar,
    EListPage,
    Editor
  },
  setup() {
    return {
      //以下为未登录时的默认值，各组件需要能够处理这些特殊数值，并且能够响应这些值的变化
      //可以用watchEffect响应这些值的变化，可参考EListPage
      loginState: ref(false),
      userType: ref(-1),
      userId: ref(-1),
      nickname: ref(''),
      exerciseId: ref(-1)
    }
  },
  methods: {
    getLogin(data) {
      this.loginState = data.loginState
      this.userType = data.mytype
      this.userId = data.userId
      this.nickname = data.nickName
    },
    getExeId(id) {
      this.exerciseId = id
      console.log(id)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
