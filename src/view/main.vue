<template>
  <el-container>
    <el-aside width="400px">
      <InviteBar></InviteBar>
      <EListPage/>
      <Comment></Comment>
    </el-aside>
    <el-main>
      <Editor/>
    </el-main>
  </el-container>
</template>

<script>
import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
import InviteBar from "@/components/InviteBar";
import Comment from "@/components/Comment";
export default {
  name: "main",
  components: {Comment, InviteBar, EListPage, Editor},
}
</script>

<style scoped>

</style>