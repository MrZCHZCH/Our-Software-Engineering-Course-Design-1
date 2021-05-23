<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-container>
          <el-aside width="60px" style="margin-top: 7px">
            <p>标题：</p>
          </el-aside>
          <el-main>
            <el-input v-model="title" placeholder="请输入标题"></el-input>
          </el-main>
        </el-container>
        <!--如果是面试官，显示富文本编辑器；如果是候选者，直接显示题目-->
        <div ref='TextEditor'></div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-select v-model="content.selected" @change="changeEditor">
                <el-option v-for="(l, idx) in content.languages" :key="idx" :value="idx" :label="l"></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button v-if="userType === 2" type="primary" plain @click="submitCode" :disabled="content.submitBtnDisable">提交代码</el-button>
            </div>
          </el-col>
        </el-row>
        <div ref="myeditor"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {onMounted, ref, reactive, onBeforeUnmount} from 'vue';
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
  props: {
    userId: Number, // 用户id
    userType: Number  // 用户类型，1为面试官，2为候选人

  },
  setup(props) {
    const title = ref('')
    const TextEditor = ref();
    const myeditor = ref()
    const content = reactive({
      code: '',
      selected: 0,
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
      submitBtnDisable: false  // 设置提交代码按钮是否可用
    })
    let myWangEditor;
    let CodeEditor;
    onMounted(() =>{
      CodeEditor = ace.edit(myeditor.value, content.options)
      CodeEditor.getSession().setValue(content.code)

      // 用户类型为面试官时才初始化文本编辑器
      myWangEditor = new WangEditor(TextEditor.value);
      // Object.assign(myWangEditor.config, {
      //   onchange() {
      //     autosavedata();
      //   },
      // });
      myWangEditor.config.onchange = autosavedata
      // 如果是候选人，则直接隐藏菜单栏
      if (props.userType === 2) {
        myWangEditor.config.menus = []
        myWangEditor.config.showFullScreen = false
      }
      myWangEditor.create();

      // 自动载入保存的内容
      axios.get('/exercise/query',{
        params: {exerciseId: 1}
      }).then(res => {
        if(res.data.respCode == 200) {
          // 载入保存的代码和语言
          content.code = res.data.exercise.code;
          CodeEditor.getSession().setValue(content.code);
          content.selected = res.data.exercise.typeOfCode;

          title.value = res.data.exercise.title;
          myWangEditor.txt.html(res.data.exercise.content)
          // 将已提交的代码设置为已读
          if(res.data.exercise.isFinished === 1){
            CodeEditor.setReadOnly(true);
          }
        }

        // 代码编辑器的change绑定一定要放在这里面
        // 否则会因为axios的异步行为导致无法设置编辑器为只读
        // 原来编辑器内容为空，query后读取到代码，即触发了一次change操作
        // 但是change操作里会将ifFinished变为0，因此会出错
        if (props.userType === 1){
          CodeEditor.setReadOnly(true);
        }
        else {
          CodeEditor.on('change', autosavedata);
          myWangEditor.disable()
        }
      })
    })

    // 自动保存函数
    const autosavedata =()=>{
      content.code = CodeEditor.getSession().getValue()
      axios.post('/exercise/save', {
        exerciseId: 1,
        title: title.value,
        teacherId: 1,
        studentId: 2,
        content: myWangEditor.txt.html(),
        isFinished: 0,  // 通过自动保存提交的代码是未完成的
        typeOfCode: content.selected,
        code: content.code
      }).then(res => {
        if(res.data.respCode == 200)
          console.log('自动保存成功')
      })
    }

    // 切换代码语言函数
    const changeEditor = () => {
      // js
      if(content.selected === 0) {
        CodeEditor.getSession().setMode('ace/mode/javascript');
        CodeEditor.getSession().setTabSize(2);
      }
      // c++
      else if(content.selected === 1) {
        CodeEditor.getSession().setMode('ace/mode/c_cpp');
        CodeEditor.getSession().setTabSize(4);
      }
      // python
      else if(content.selected === 2) {
        CodeEditor.getSession().setMode('ace/mode/python')
        CodeEditor.getSession().setTabSize(4);
      }
      // java
      else if(content.selected === 3) {
        CodeEditor.getSession().setMode('ace/mode/java');
        CodeEditor.getSession().setTabSize(4);
      }
      content.code = ''
      CodeEditor.getSession().setValue(content.code)
    }

    // 最终提交代码函数
    const submitCode = () => {
      if(content.code === '') {
        alert("输入的代码为空！请先输入代码。")
        return;
      }

      axios.post('/exercise/save', {
        exerciseId: 1,
        title: title.value,
        teacherId: 1,
        studentId: 2,
        content: myWangEditor.txt.html(),
        isFinished: 1,  // 通过提交按钮提交的代码一定是完成的
        typeOfCode: content.selected,
        code: content.code
      }).then(res => {
        if(res.data.respCode == 200) {
          alert('代码提交成功！');
          // 代码提交成功后设置代码编辑器只读和按钮不可用
          CodeEditor.setReadOnly(true);
          content.submitBtnDisable = true;
        }
        else {
          alert("代码保存失败，请稍后重试。")
        }
      })
    }

    onBeforeUnmount(() => {
      myWangEditor.destroy();
      myWangEditor = null;
    });

    return {
      submitCode,
      changeEditor,
      myeditor,
      content,
      TextEditor,
      title
    }
  },
  // watch: {
  //   json(val) {
  //     const editorValue = this.editor.getValue()
  //     if (val !== editorValue) {
  //       this.editor.setValue(this.json)
  //     }
  //   },
  // },
}
</script>

<style scoped>

</style>