<template>
  <el-card v-for="(exe,i) in exercise" :key="exe.exerciseId" body-style="padding: 5px">
    <el-container>
      <el-main style="padding: 0">
        {{ i + 1 }} : {{ exe.title }}
      </el-main>
      <el-aside width="auto">
        <el-button @click="enter(exe.exerciseId)">进入</el-button>
        <el-button v-if="userType == 1" @click="del(exe.exerciseId,i)">删除</el-button>
      </el-aside>
    </el-container>
  </el-card>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "EListPage",
  props: ['userType','userId'],
  setup(props) {
    const exercise = ref([])
    onMounted(() => {
      axios.get('/exercise/query_by_user', {
        params: {
          userId: props.userId
        }
      }).then(res => {
        if (res.data.respCode == 200)
          exercise.value = res.data.items
      })
    })
    return {
      exercise
    }
  },
  methods: {
    del(exerciseId, id) {
      let this_ = this
      let re = false
      this.$confirm('此操作将永久删除该面试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await axios.get('/exercise/delete', {
          params: {
            exerciseId: exerciseId
          }
        }).then(res => {
          if (res.data.respCode == 200) {
            this_.exercise.splice(id, 1);
            re = true
          }
        })
        if (re) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    enter(id) {
      console.log(id)
    }
  }
}
</script>

<style scoped>

</style>