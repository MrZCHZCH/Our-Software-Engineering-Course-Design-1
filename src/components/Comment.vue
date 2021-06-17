<template>
  <el-card class="box-card" shadow="never">
    <el-row>
      <ul class="infinite-list item" style="overflow:auto; list-style: none; height: 250px; padding: 5px; width: 100%">
        <div v-for="(comment,idx) in data.comments" :key="idx">
          <hr v-if="idx != 0"/>
          <li class="infinite-list-item">
            <!--          <div>-->
            <!--            <span>{{comments[comment - 1].nickname}}</span>-->
            <!--            <hr/>-->
            <!--            <span style="color: gray">{{data.comment[comment - 1].email}}</span>-->
            <!--          </div>-->
            <div>
              <p>{{comment.content}}</p>
            </div>
          </li>
        </div>
      </ul>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入评论内容"
            v-model="data.content"
            resize="none"
            :readonly="!app.loginState || app.exerciseId == -1">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
            type="primary"
            plain
            @click="saveComment"
            :disabled="!app.loginState || app.exerciseId == -1"
            size="mini"
            style="height: 100%; width: 100%"
            class="el-icon-check">
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {onMounted, inject, watch, onBeforeUnmount, reactive} from 'vue';
import axios from 'axios';

export default {
  name: "Comment",
  inject: ['app'],
  setup() {
    const app = inject('app')
    const data = reactive({
      comments: [],
      content: ''
    })
    let commentCounter = 0
    let autoLoadTimer = null

    onMounted(() => {
      loadComment()
      autoLoadTimer = setInterval(loadComment, 2000)
    })
    onBeforeUnmount(() => {
      clearInterval(autoLoadTimer)
    })


    watch(() => app.exerciseId, loadComment)

    const loadComment = () => {
      if (app.exerciseId != -1) {
        axios.get('/comment/exercise_query', {
          params: {exerciseId: app.exerciseId}
        }).then(res => {
          if (res.data.respCode == 200) {
            data.comments = res.data.comments
          }
          else {
            data.comments = []
          }
        })
      }
    }
    return {
      app,
      data,
      commentCounter,
    }
  },
  methods: {
    saveComment() {
      if (this.data.content == '') {
        alert('请先输入评论！')
        return 0
      }
      axios.post('/comment/save', {
        exerciseId: this.app.exerciseId,
        replyId: this.app.userId,
        content: this.data.content
      }).then(res => {
        if (res.data.respCode == 200) {
          this.data.content = ''
        }
        else {
          alert('评论提交失败，请稍后重试！')
        }
      })
    },
    load() {
      this.commentCounter += 5
    }
  }
}
</script>

<style scoped>
.item {
  margin-bottom: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width:99%;
}

</style>