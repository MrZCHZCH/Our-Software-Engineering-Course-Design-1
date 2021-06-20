<template>
  <el-container>
    <el-main style="padding: 0">
      <el-input v-model="input" :disabled="!app.loginState||app.userType!=1||app.exerciseId<0"
                :placeholder="placeholder"></el-input>
    </el-main>
    <el-aside width="auto">
      <el-button :disabled="!app.loginState||app.userType!=1||app.exerciseId<0" @click="invite">邀请</el-button>
    </el-aside>
  </el-container>
</template>

<script>
import {inject, onMounted, ref, watch} from 'vue'
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "InviteBar",
  inject: ['app'],
  setup() {
    const app = inject('app')
    const placeholder = ref("这里显示用户邀请信息")
    const setPlaceHolder = () => {
      if (app.exerciseId > 0 && app.userType == 1)
        axios.get('/exercise/query', {
          params: {exerciseId: app.exerciseId}
        }).then(res => {
          if (res.data.respCode == 200)
            if (res.data.exercise.studentId) {
              axios.get('user/query', {
                params: {userId: res.data.exercise.studentId}
              }).then(res => {
                if (res.data.respCode == 200)
                  placeholder.value = '该题目已邀请用户：' + res.data.user.nickName
              })
            } else
              placeholder.value = "输入待邀请用户邮箱"
        });
      else
        placeholder.value = "这里显示用户邀请信息"
    }
    onMounted(() => {
      setPlaceHolder()
    })
    watch(
        () => app.exerciseId,
        () => {
          setPlaceHolder()
        }
    )
    return {
      input: ref(''),
      placeholder,
      app,
      setPlaceHolder
    }
  },
  methods: {
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.input);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    invite() {
      let this_ = this
      if (!this.validateMail())
        ElMessage.warning('输入的邮箱格式不正确');
      else
        axios.get('/exercise/invite', {
          params: {
            email: this.input,
            exerciseId: this.app.exerciseId
          }
        }).then(res => {
          if (res.data.respCode == 200 && res.data.msg == '邀请成功!') {
            this_.input = ''
            ElMessage.success(res.data.msg)
          } else {
            ElMessage.error(res.data.msg)
          }
          this.setPlaceHolder()
        });
    }
  }
}
</script>

<style scoped>

</style>