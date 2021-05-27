<template>
  <log-in-bar/>
  <el-row>
    <el-col :span="18"><Editor :user-id="1" :user-type="1"/></el-col>
    <el-col :span="6"><EListPage :user-id="1" :user-type="1"/></el-col>
  </el-row>
</template>

<script>

import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
import LogInBar from "@/components/LogInBar";
export default {
  name: 'App',
  components: {
    LogInBar,
    EListPage,
    Editor

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
