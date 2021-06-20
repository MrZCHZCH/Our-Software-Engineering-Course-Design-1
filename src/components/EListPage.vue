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
      height="400"
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
import {ElMessage, ElNotification} from 'element-plus'
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
            return res.data.items.reverse()
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
            isFinished: 1
          }, {
            exerciseId: 3,
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
      let maxId = -1
      let oldlength = exercise.value.length
      if (exercise.value[0])
        maxId = exercise.value[0].exerciseId
      let data = await loadData()
      if (data.length > 0) {
        let selected = null
        if (currentRow.value)
          selected = data.find(item => item.exerciseId === currentRow.value.exerciseId)
        exercise.value = data
        if (selected)
          singleTable.value.setCurrentRow(selected);
        if ((data[0].exerciseId > maxId && app.userType == 2) || data.length > oldlength)
          ElNotification({
            title: '提示',
            message: '收到了新题目',
            duration: 0
          });
      }
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
    const tableRowClassName = ({row}) => {
      if (row.isFinished == 1)
        return 'success-row';
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
        }).then(async res => {
          if (res.data.respCode == 200) {
            this_.exercise = await this_.loadData()
            this_.currentRow = null;
            if (this_.app.exerciseId == exerciseId)
              this_.app.setExeId(-1)
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
      let this_ = this
      axios.post('/exercise/save', {
        teacherId: this.app.userId,
        title: '新建问题' + Date()
      }).then(async res => {
        if (res.data.respCode == 200) {
          this_.exercise = await this_.loadData()
          this_.singleTable.setCurrentRow(this_.exercise[0]);
          ElMessage.success('创建成功')
          this_.app.setExeId(res.data.exercise.exerciseId)
        } else
          ElMessage.error('创建失败')
      })
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