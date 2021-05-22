<template>
  <div style="text-align: center">
    <el-container>
      <el-aside style="margin-top: 7px" width="auto">
        <p>邮箱：</p>
        <p>密码：</p>
      </el-aside>
      <el-main>
        <el-input v-model="email" placeholder="请输入邮箱"></el-input>
        <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
      </el-main>
    </el-container>
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
import {ref} from 'vue';
import axios from "axios";
import {setCookie} from "@/cookies";

export default {
  name: "LogInPage",
  setup() {
    return {
      email: ref(''),
      password: ref('')
    }
  },
  methods: {
    validateMail() {         //验证邮件规则
      return /^\w{3,15}@\w+\.[a-z]{2,3}$/.test(this.email);//前缀可以是字母或者数字，在3位以上15位以下，后缀是2位或者3位   \w:表示字母数字或者下划线
    },
    login() {
      let this_ = this
      if (!this.validateMail()) {
        this.$alert('输入的邮箱格式不正确', '提醒', {
          confirmButtonText: '确定'
        });
      } else {
        axios.post('/index/login', {
          email: this.email,
          password: this.password
        }).then(res => {
          this_.$alert(res.data.msg, '提醒', {
            confirmButtonText: '确定'
          });
          if (res.data.respCode == 200) {
            setCookie('userId', res.data.user.userId, 10)
          }
        });
        //     .catch(err => {
        //   this_.$alert('网络出错，请重试', '提醒', {
        //     confirmButtonText: '确定'
        //   });
        //   console.log(err);
        // })
      }
    }
  }
}
</script>

<style scoped>

</style>