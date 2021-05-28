<template>
  <el-table
      ref="singleTable"
      :data="exercise"
      :row-class-name="tableRowClassName"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange">
    <el-table-column
        prop="exerciseId"
        width="80px">
    </el-table-column>
    <el-table-column
        prop="title"
        width="auto">
    </el-table-column>
  </el-table>
  <el-button :disabled="!loginState||userType!=1||currentRow==null" @click="del">删除</el-button>
  <el-button :disabled="!loginState||currentRow==null" @click="enter">进入</el-button>
  <el-button :disabled="!loginState||userType!=1||currentRow==null" @click="create">创建</el-button>
</template>

<script>
import {ref, watchEffect} from "vue";
import axios from "axios";

export default {
  name: "EListPage",
  props: ['userType', 'userId', 'loginState'],
  emits: ['setExeId'],
  setup(props) {
    const exercise = ref([])
    const loadData = () => {
      if (props.loginState) {
        axios.get('/exercise/query_by_user', {
          params: {
            userId: props.userId
          }
        }).then(res => {
          if (res.data.respCode == 200)
            exercise.value = res.data.items
        })
      } else {
        exercise.value = [
          {
            exerciseId: 1,
            title: '这里展示的是你所属的面试题'
          }, {
            exerciseId: 2,
            title: '绿色代表该面试题已提交',
            isFinished: 0
          }, {
            exerciseId: 3,
            title: '红色代表这是新的面试题'
          }, {
            exerciseId: 4,
            title: '蓝色代表该面试题被选中'
          }
        ]
      }
    }
    watchEffect(() => {
      loadData()
    })
    return {
      exercise,
      loadData,
      currentRow: ref(null)
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.isFinished == 0) {
        return 'success-row';
      } else if (rowIndex < 3) {
        return 'warning-row';
      }
      return '';
    },
    del() {
      let exerciseId = this.currentRow.exerciseId
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
            this_.loadData()
            this_.currentRow = null;
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
    enter() {
      this.$emit('setExeId', this.currentRow.exerciseId)
    },
    create() {
      console.log("没做")
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>