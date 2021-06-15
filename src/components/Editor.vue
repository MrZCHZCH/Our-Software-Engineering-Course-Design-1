<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-container>
          <el-aside width="60px" style="margin-top: 7px">
            <p>标题：</p>
          </el-aside>
          <el-main>
            <el-input v-on:change="saveContent" v-model="title" placeholder="请输入标题" :readonly="content.titleReadOnly"></el-input>
          </el-main>
        </el-container>
        <!--如果是面试官，显示富文本编辑器；如果是候选者，直接显示题目-->
        <div ref='textEditor'></div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-select v-model="content.selected" :disabled="content.selectedDisable">
                <el-option v-for="(l, idx) in content.languages" :key="idx" :value="idx" :label="l"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button v-if="app.userType === 2 && app.loginState" type="primary" plain @click="submitCode" :disabled="content.submitBtnDisable">提交代码</el-button>
            </div>
          </el-col>
        </el-row>
        <div ref="codeEditor"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {onMounted, ref, reactive, onBeforeUnmount, inject, watch} from 'vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver'; // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-tomorrow'; // 主题(白色）
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-chrome'; // 灰
import 'ace-builds/src-noconflict/theme-solarized_light'; // 黄
import 'ace-builds/src-noconflict/theme-dreamweaver';  //
import 'ace-builds/src-noconflict/mode-javascript'; // 语言模式
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import axios from 'axios';
import WangEditor from 'wangeditor';

export default {
  name: "Editor",
  inject:['app'],
  setup() {
    const app = inject('app')
    const title = ref('')
    const textEditor = ref()
    const codeEditor = ref()
    const content = reactive({
      selected: 0,
      teacherId: -1,
      studentId: -1,
      languages: ['JavaScript', 'C++', 'Python', 'Java'],
      options: {
        mode: 'ace/mode/javascript',
        theme: 'ace/theme/tomorrow', // 主题样式
        tabSize: 2,
        maxLines: 20, // 最大行数，超过会自动出现滚动条
        minLines: 20, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 16, // 编辑器内字体大小
        highlightActiveLine: true
      },
      submitBtnDisable: true,  // 设置提交代码按钮是否可用
      selectedDisable: true,
      allLoadFinished: false,
      titleReadOnly: true
    })
    let wangEditor
    let aceEditor
    let autoLoadTimer

    onMounted(() =>{
      aceEditor = ace.edit(codeEditor.value, content.options)
      aceEditor.getSession().setValue('')

      wangEditor = new WangEditor(textEditor.value);
      wangEditor.config.showFullScreen = false
      wangEditor.config.excludeMenus = [
        'emoticon',
        'video',
        'image'
      ]
      wangEditor.create();

      aceEditor.setReadOnly(true)
      wangEditor.disable()
    })

    onBeforeUnmount(() => {
      wangEditor.destroy();
      wangEditor = null;
      clearInterval(autoLoadTimer)
    });

    const loadCode = () => {
      if (app.loginState && app.exerciseId != -1 && app.userType == 1) {
        axios.get('/exercise/query',{
          params: {exerciseId: app.exerciseId}
        }).then(res => {
          if(res.data.respCode == 200) {
            content.selected = res.data.exercise.typeOfCode
            let newCode = res.data.exercise.code
            if (newCode != aceEditor.getSession().getValue()) {
              aceEditor.setReadOnly(false)
              aceEditor.getSession().setValue(newCode)
              aceEditor.setReadOnly(true)
            }
          }
        })
      }
      console.log("loadCode")
    }

    const saveCode = () => {
      if (app.loginState && app.userType == 2 && app.exerciseId != -1 && content.allLoadFinished) {
        axios.post('/exercise/save', {
          exerciseId: app.exerciseId,
          teacherId: content.teacherId,
          studentId: content.studentId,
          isFinished: 0,  // 通过自动保存提交的代码是未完成的
          typeOfCode: content.selected,
          code: aceEditor.getSession().getValue()
        }).then(res => {
          if(res.data.respCode == 200)
            console.log('自动保存成功')
        })
      }
    }

    const loadContent = () => {
      if (app.loginState && app.exerciseId != -1 && app.userType == 2) {
        axios.get('/exercise/query',{
          params: {exerciseId: app.exerciseId}
        }).then(res => {
          if(res.data.respCode == 200) {
            // 载入试题的信息
            title.value = res.data.exercise.title
            wangEditor.enable()
            wangEditor.txt.html(res.data.exercise.content)
            wangEditor.disable()
            aceEditor.focus()
          }
        })
      }
      console.log('load c')
    }

    const saveContent = () => {
      if (app.loginState && app.userType == 1 && app.exerciseId != -1 && content.allLoadFinished) {
        content.code = aceEditor.getSession().getValue()
        axios.post('/exercise/save', {
          exerciseId: app.exerciseId,
          title: title.value,
          content: wangEditor.txt.html(),
        }).then(res => {
          if(res.data.respCode == 200)
            console.log('自动保存成功')
        })
      }
    }

    // 切换代码语言函数
    const changeEditor = ()=> {
      // js
      if(content.selected === 0) {
        aceEditor.getSession().setMode('ace/mode/javascript');
        aceEditor.getSession().setTabSize(2);
      }
      // c++
      else if(content.selected === 1) {
        aceEditor.getSession().setMode('ace/mode/c_cpp');
        aceEditor.getSession().setTabSize(4);
      }
      // python
      else if(content.selected === 2) {
        aceEditor.getSession().setMode('ace/mode/python')
        aceEditor.getSession().setTabSize(4);
      }
      // java
      else if(content.selected === 3) {
        aceEditor.getSession().setMode('ace/mode/java');
        aceEditor.getSession().setTabSize(4);
      }
    }

    // 最终提交代码函数
    const submitCode = ()=> {
      if(aceEditor.getSession().getValue() == '') {
        alert("输入的代码为空！请先输入代码。")
        return;
      }

      axios.post('/exercise/save', {
        exerciseId: app.exerciseId,
        title: title.value,
        teacherId: content.teacherId,
        studentId: content.studentId,
        content: wangEditor.txt.html(),
        isFinished: 1,  // 通过提交按钮提交的代码一定是完成的
        typeOfCode: content.selected,
        code: aceEditor.getSession().getValue()
      }).then(res => {
        if(res.data.respCode == 200) {
          alert('代码提交成功！');
          // 代码提交成功后设置代码编辑器只读和按钮不可用
          aceEditor.setReadOnly(true);
          content.submitBtnDisable = true;
        }
        else {
          alert("代码保存失败，请稍后重试。")
        }
      })
    }

    // LoginState监测的处理函数
    const detachLoginState = ()=> {
      if(app.loginState == false) {
        clearInterval(autoLoadTimer)
        wangEditor.enable()
        wangEditor.txt.html('')
        wangEditor.disable()

        aceEditor.setReadOnly(false)
        aceEditor.getSession().setValue('')
        aceEditor.setReadOnly(true)

        content.selectedDisable = true
        content.submitBtnDisable = true
        content.allLoadFinished = false
        content.titleReadOnly = true
      }
      else {
        wangEditor.enable()
        aceEditor.setReadOnly(false)
      }
    }

    // UserType监测的处理函数
    const detachUserType = () => {
      // 面试官
      if (app.loginState && app.userType == 1) {
        wangEditor.enable()
        aceEditor.setReadOnly(true)

        autoLoadTimer = setInterval(loadCode, 5000)
        wangEditor.config.onchange = saveContent

        content.selectedDisable = true
        content.submitBtnDisable = true
        content.titleReadOnly = false
      }
      // 候选者
      else if (app.loginState && app.userType == 2) {
        wangEditor.disable()
        aceEditor.setReadOnly(false)

        autoLoadTimer = setInterval(loadContent, 5000)
        aceEditor.on('change', saveCode)

        content.selectedDisable = false
        content.titleReadOnly = true
      }
    }

    // ExerciseId监测的处理函数，自动加载对应的试题信息
    const autoLoadExercise = ()=> {
      if (app.exerciseId != -1) {
        content.allLoadFinished = false
        content.submitBtnDisable = false
        axios.get('/exercise/query',{
          params: {exerciseId: app.exerciseId}
        }).then(res => {
          if(res.data.respCode == 200) {
            // 载入试题的各种信息
            content.teacherId = res.data.teacherId
            content.studentId = res.data.studentId
            title.value = res.data.exercise.title;
            content.selected = res.data.exercise.typeOfCode;

            // 载入保存的代码和题目
            aceEditor.setReadOnly(false)
            if (res.data.exercise.code == null) {
              aceEditor.getSession().setValue('');
            }
            else {
              aceEditor.getSession().setValue(res.data.exercise.code);
            }
            wangEditor.enable()
            if (res.data.exercise.content == null) {
              console.log('null')
              wangEditor.txt.html('')
            }
            else {
              console.log('not null')
              wangEditor.txt.html(res.data.exercise.content)
            }
            // 面试官
            if (app.userType == 1) {
              aceEditor.setReadOnly(true)
            }
            // 候选者
            if (app.userType == 2) {
              wangEditor.disable()
            }

            // 将已提交的代码设置为已读
            if(res.data.exercise.isFinished == 1){
              aceEditor.setReadOnly(true);
              content.submitBtnDisable = true
            }
            content.allLoadFinished = true
          }
        })
      }
      else {
        content.submitBtnDisable = true
      }
    }

    watch(() => app.loginState, detachLoginState)
    watch(() => app.userType, detachUserType)
    watch(() => app.exerciseId, autoLoadExercise)
    watch(() => content.selected, changeEditor)

    return {
      app,
      submitCode,
      changeEditor,
      codeEditor,
      content,
      textEditor,
      title,
      saveContent
    }
  },
  methods:{

  }
}
</script>

<style>
.w-e-toolbar {
  z-index: 2!important;
}
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>

<style scoped>


</style>