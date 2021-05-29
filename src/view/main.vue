<template>
  <el-row>
    <el-col :span="18">
      <Editor :user-id="1" :user-type="1"/>
    </el-col>
    <el-col :span="6">
      <EListPage/>
    </el-col>
  </el-row>
</template>

<script>
import Editor from "@/components/Editor";
import EListPage from "@/components/EListPage";
export default {
  name: "main",
  components: {EListPage, Editor},
}
</script>

<style scoped>

</style>