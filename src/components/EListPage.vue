<template>
  <div style="text-align: center">
    <el-button :disabled="!app.loginState||app.userType!=1||currentRow==null" @click="del">删除</el-button>
    <el-button :disabled="!app.loginState||currentRow==null" @click="enter">进入</el-button>
    <el-button :disabled="!app.loginState||app.userType!=1" @click="create">创建</el-button>
    <el-button :disabled="!app.loginState||currentRow==null" @click="copy">分享</el-button>
  </div>
  <el-table
      ref="singleTable"
      :data="exercise"
      :row-class-name="tableRowClassName"
      :show-header="false"
      border
      height="500"
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
</template>

<script>
import {inject, onBeforeUnmount, onMounted, ref, watch} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {ElMessage} from 'element-plus'
import useClipboard from 'vue-clipboard3'

export default {
  name: "EListPage",
  inject: ['app'],
  setup() {
    // 装载数据
    const app = inject('app')
    const exercise = ref([])
    const router = useRoute()
    const loadData = async () => {
      if (app.loginState) {
        return await axios.get('/exercise/query_by_user', {
          params: {
            userId: app.userId
          }
        }).then(res => {
          if (res.data.respCode == 200)
            return res.data.items
          else
            return []
        })
      } else {
        return [
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
    watch(
        () => app.userId,
        async () => {
          exercise.value = await loadData()
        }
    )

    // 刷新数据
    const singleTable = ref()
    let timer
    const reData = async () => {
      //!这里差新题目提醒
      let data = await loadData()
      let id = -1
      if (currentRow.value){
        let target = currentRow.value.exerciseId
        for (let i = 0; i < data.length; i++)
          if (data[i].exerciseId == target) {
            id = i
            break
          }
      }
      exercise.value = data
      if (id >= 0)
        singleTable.value.setCurrentRow(exercise.value[id]);
    }
    onMounted(async () => {
      if (router.query.exerciseId)
        app.setExeId(router.query.exerciseId)
      exercise.value = await loadData()
      timer = setInterval(reData, 3000)
    })
    onBeforeUnmount(() => {
      clearInterval(timer);
    })

    // 分享链接
    const {toClipboard} = useClipboard()
    const shareLink = ref('')
    const copy = async () => {
      try {
        await toClipboard(shareLink.value)
        ElMessage.success('链接已复制成功');
      } catch (e) {
        ElMessage.error('链接复制失败');
      }
    }

    // 列表处理
    const currentRow = ref(null)
    const tableRowClassName = ({row, rowIndex}) => {
      if (row.isFinished == 0) {
        return 'success-row';
      } else if (rowIndex < 3) {
        return 'warning-row';
      }
      return '';
    }
    const handleCurrentChange = (val) => {
      currentRow.value = val;
      if (val)
        shareLink.value = "http://localhost:8080/#/?exerciseId=" + val.exerciseId
    }

    return {
      exercise,
      loadData,
      app,
      shareLink,
      copy,
      currentRow,
      tableRowClassName,
      handleCurrentChange,
      singleTable
    }
  },
  methods: {
    // 删除
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
          ElMessage.success('删除成功')
        } else {
          ElMessage.error('删除失败')
        }
      }).catch(() => {
        ElMessage('已取消删除')
      });
    },
    // 进入
    enter() {
      this.app.setExeId(this.currentRow.exerciseId)
    },
    // 创建
    create() {
      console.log("没做")
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

.el-table__row {
  font-size: 15px;
}
</style>