<template>
  <div style="text-align: center">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" label="邮箱:">
        <el-input v-model="form.email" autocomplete="off" clearable placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="用户名:">
        <el-input v-model="form.nickname" autocomplete="off" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="密码:">
        <el-input v-model="form.password1" autocomplete="off" clearable placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="确认密码:">
        <el-input v-model="form.password2" autocomplete="off" clearable placeholder="请再次输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="用户类别:">
        <el-radio v-model="form.type" label="1">面试官</el-radio>
        <el-radio v-model="form.type" label="2">候选人</el-radio>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="register">注册</el-button>
  </div>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import {ElMessage} from 'element-plus'

export default {
  name: "RegisterPage",
  setup() {
    return {
      form: reactive({
        email: '',
        password1: '',
        password2: '',
        nickname: '',
        type: '2'
      }),
      formLabelWidth: '100px'
    }
  },
  methods: {
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.form.email);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    register() {
      let this_ = this
      if (!this.validateMail()) {
        ElMessage.warning('输入的邮箱格式不正确');
      } else if (this.form.password1.length < 8 && this.form.password1.length > 16) {
        ElMessage.warning('密码长度必须为8至15位');
      } else if (this.form.nickname.length < 1) {
        ElMessage.warning('用户名不能为空');
      } else if (this.form.password1 !== this.form.password2) {
        ElMessage.warning('两次输入的密码不一致');
      } else {
        axios.post('/index/register', {
          email: this.form.email,
          password: this.form.password1,
          nickName: this.form.nickname,
          mytype: parseInt(this.form.type)
        }).then(res => {
          this_.$alert(res.data.msg, '提醒', {
            confirmButtonText: '确定'
          });
          if (res.data.respCode == 200) {
            this.form.password1 = ''
            this.form.nickname = ''
            this.form.email = ''
            this.form.password2 = ''
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