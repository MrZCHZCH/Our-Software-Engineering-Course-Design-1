<template>
  <div style="text-align: center">
    <el-container>
      <el-aside style="margin-top: 8px" width="auto">
        <p>邮箱:</p>
        <p>用户名:</p>
        <p>密码:</p>
        <p>确认密码:</p>
        <p>用户类别:</p>
      </el-aside>
      <el-main>
        <el-input v-model="email" clearable placeholder="请输入邮箱"></el-input>
        <el-input v-model="nickname" clearable placeholder="请输入用户名"></el-input>
        <el-input v-model="password1" clearable placeholder="请输入密码" show-password></el-input>
        <el-input v-model="password2" clearable placeholder="请再次输入密码" show-password></el-input>
        <el-radio v-model="type" label="1" style="margin-top: 8px">面试官</el-radio>
        <el-radio v-model="type" label="2" style="margin-top: 8px">候选人</el-radio>
      </el-main>
    </el-container>
    <el-button type="primary" @click="register">注册</el-button>
  </div>
</template>

<script>
import {ref} from "vue";
import axios from "axios";
import {ElMessage} from 'element-plus'

export default {
  name: "RegisterPage",
  setup() {
    return {
      email: ref(''),
      password1: ref(''),
      password2: ref(''),
      nickname: ref(''),
      type: ref('2')
    }
  },
  methods: {
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.email);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    register() {
      let this_ = this
      if (!this.validateMail()) {
        ElMessage.warning('输入的邮箱格式不正确');
      } else if (this.password1.length < 8 && this.password1.length > 16) {
        ElMessage.warning('密码长度必须为8至15位');
      } else if (this.nickname.length < 1) {
        ElMessage.warning('用户名不能为空');
      } else if (this.password1 !== this.password2) {
        ElMessage.warning('两次输入的密码不一致');
      } else {
        axios.post('/index/register', {
          email: this.email,
          password: this.password1,
          nickName: this.nickname,
          mytype: parseInt(this.type)
        }).then(res => {
          this_.$alert(res.data.msg, '提醒', {
            confirmButtonText: '确定'
          });
          if (res.data.respCode == 200) {
            this.password1 = ''
            this.nickname = ''
            this.email = ''
            this.password2 = ''
            this.$emit('success')
          }
        });
      }
    }
  }
}
</script>

<style scoped>
</style>