<template>
  <el-container>
    <el-aside width="380px">
      <InviteBar></InviteBar>
      <EListPage/>
    </el-aside>
    <el-main>
<!--      <Editor/>-->
    </el-main>
  </el-container>
</template>

<script>
// import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
import InviteBar from "@/components/InviteBar";
export default {
  name: "main",
  components: {InviteBar, EListPage},
}
</script>

<style scoped>

</style>