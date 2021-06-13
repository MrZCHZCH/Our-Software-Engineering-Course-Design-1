<template>
  <div style="text-align: center">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" label="邮箱:">
        <el-input v-model="form.email" autocomplete="off" clearable placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="密码:">
        <el-input v-model="form.password" autocomplete="off" clearable placeholder="请输入密码" show-password></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
import {reactive} from 'vue';
import axios from "axios";
// import {setCookie} from "@/cookies";
import {ElMessage} from 'element-plus'

export default {
  name: "LogInPage",
  setup() {
    return {
      form: reactive({
        email: '',
        password: ''
      }),
      formLabelWidth: '50px'
    }
  },
  methods: {
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.form.email);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    login() {
      let this_ = this
      if (!this.validateMail()) {
        ElMessage.warning('输入的邮箱格式不正确');
      } else if (this.form.password.length < 8 && this.form.password.length > 16) {
        ElMessage.warning('密码长度必须为8至15位');
      } else {
        axios.post('/index/login', {
          email: this.form.email,
          password: this.form.password
        }).then(res => {
          this_.$alert(res.data.msg, '提醒', {
            confirmButtonText: '确定'
          });
          if (res.data.respCode == 200) {
            // setCookie('userId', res.data.user.userId, 10)
            res.data.user.loginState = true
            this.form.email = ''
            this.form.password = ''
            this.$emit('success', res.data.user)
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>