<template>
  <log-in-page/>
  <EListPage :user-id="1" :user-type="1"/>
  <Editor :user-id="1" :user-type="1"/>
</template>

<script>

import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
import LogInPage from "@/components/LogInPage";
export default {
  name: 'App',
  components: {
    LogInPage,
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
