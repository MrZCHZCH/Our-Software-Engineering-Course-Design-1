<template>
  <div id="app">
    <nav-bar/>
    <router-view></router-view>
  </div>
</template>

<script>

import {ref} from "vue";
import NavBar from "@/components/NavBar";

export default {
  name: 'App',
  components: {
    NavBar
  },
  provide() {
    return {
      app: this
    }
  },
  setup() {
    return {
      //以下为未登录时的默认值，各组件需要能够处理这些特殊数值，并且能够响应这些值的变化
      //使用provide/inject传递参数，不使用prop!!!可参考EListPage与loginbar
      //可以用watch响应这些值的变化，可参考EListPage
      loginState: ref(false),
      userType: ref(-1),
      userId: ref(-1),
      nickname: ref(''),
      exerciseId: ref(-1)
    }
  },
  methods: {
    setLogin(data) {
      this.loginState = data.loginState
      this.userType = data.mytype
      this.userId = data.userId
      this.nickname = data.nickName
    },
    setExeId(id) {
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
  min-width: 1024px;
  /*margin-top: 60px;*/
}

.el-button {
  font-size: medium;
}
</style>
