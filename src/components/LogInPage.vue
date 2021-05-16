<template>
  <el-container>
    <el-aside width="70px" style="margin-top: 7px">
      <p>邮箱：</p>
      <p>密码：</p>
    </el-aside>
    <el-main>
      <el-input v-model="email" placeholder="请输入邮箱"></el-input>
      <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
    </el-main>
  </el-container>
  <el-button type="primary" @click="login">登录</el-button>
</template>

<script>
import { ref } from 'vue';
export default {
  name: "LogInPage",
  setup() {
    return {
      email: ref(''),
      password: ref('')
    }
  },
  methods:{
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.email);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    login(){
      if(!this.validateMail()){
        this.$alert('输入的邮箱格式不正确', '提醒', {
          confirmButtonText: '确定'
        });
      }
    }
  }
}
</script>

<style scoped>

</style>