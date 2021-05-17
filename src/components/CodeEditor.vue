<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-select v-model="content.selected" @change="changeEditor">
            <el-option v-for="(l, idx) in content.languages" :key="idx" :value=l :label=l></el-option>
          </el-select>
          <span>Selected: {{content.selected}}(测试用）</span>
        </div>
      </el-col>

      <el-col :span="6" :offset="12">
        <div class="grid-content bg-purple">
          <el-button type="primary" plain @click="submitCode">提交代码</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div ref="myeditor"></div>
      </el-col>
    </el-row>
  </div>

  <p>已输入代码（测试用）</p>
  <p>{{content.code}}</p>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver'; // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-tomorrow'; // 主题(白色）
import 'ace-builds/src-noconflict/theme-chrome'; // 灰
import 'ace-builds/src-noconflict/theme-solarized_light'; // 黄
import 'ace-builds/src-noconflict/theme-dreamweaver';  //
import 'ace-builds/src-noconflict/mode-javascript'; // 语言模式
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';

export default {
  name: "CodeEditor",
  // props: {
  //   json: {
  //     type: String,
  //     default: '',
  //   },
  // },
  setup() {
    const myeditor = ref()
    const content = reactive({
      code: '',
      selected: 'JavaScript',
      languages: ['JavaScript', 'C++', 'Python', 'Java'],
      options: {
        mode: 'ace/mode/javascript',
        theme: 'ace/theme/tomorrow', // 主题样式
        tabSize: 2,
        maxLines: 20, // 最大行数，超过会自动出现滚动条
        minLines: 20, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 16, // 编辑器内字体大小
        highlightActiveLine: true
      }
    })
    let editor;
    onMounted(() =>{
      editor = ace.edit(myeditor.value, content.options)
      editor.getSession().setValue(content.code)
      editor.on('change', function (){
        content.code = editor.getSession().getValue()
      })
    })

    const changeEditor = () => {
      if(content.selected === 'JavaScript') {
        editor.getSession().setMode('ace/mode/javascript');
        editor.getSession().setTabSize(2);
      }
      else if(content.selected === 'C++') {
        editor.getSession().setMode('ace/mode/c_cpp');
        editor.getSession().setTabSize(4);
      }
      else if(content.selected === 'Python') {
        editor.getSession().setMode('ace/mode/python')
        editor.getSession().setTabSize(4);
      }
      else if(content.selected === 'Java') {
        editor.getSession().setMode('ace/mode/java');
        editor.getSession().setTabSize(4);
      }
      content.code = ''
      editor.getSession().setValue(content.code)
    }

    const submitCode = () => {
      if(content.code === '') {
        alert("输入的代码为空！请先输入代码。")
      }
    }

    return {
      submitCode,
      changeEditor,
      myeditor,
      content
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
/*.editor {*/
/*  height: 100%;*/
/*  position: relative;*/
/*  text-align: left;*/
/*}*/
/*.editor >>> .CodeMirror {*/
/*  height: auto;*/
/*  min-height: 250px;*/
/*}*/
/*.editor >>> .CodeMirror-scroll {*/
/*  min-height: 250px;*/
/*}*/
/*.editor >>> .cm-s-rubyblue span.cm-string {*/
/*  color: #f08047;*/
/*}*/
</style>