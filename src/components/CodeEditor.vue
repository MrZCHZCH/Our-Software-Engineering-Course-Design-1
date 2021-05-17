<template>
  <div style="text-align: left">
    <select v-model="content.selected" @change="changeEditor">
      <option v-for="(l, idx) in languages" :key="idx" :value=l>{{l}}</option>
    </select>
    <span>Selected: {{content.selected}}</span>
  </div>
  <div class="ace-container">
    <div class="ace-editor" ref="myeditor"></div>
  </div>
  <p>已输入代码（测试用）</p>
  <p>{{content.code}}</p>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/webpack-resolver'; // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-monokai'; // 主题
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
      options: {
        mode: 'ace/mode/javascript',
        theme: 'ace/theme/monokai', // 主题样式
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
      // Object.assign(editor.config, {
      //   onchange(){
      //     content.code = editor.getSession().getValue()
      //   }
      // })
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

    return {
      changeEditor,
      myeditor,
      content
    }
  },
  data() {
    return {

      languages: ['JavaScript', 'C++', 'Python', 'Java']
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
.editor {
  height: 100%;
  position: relative;
  text-align: left;
}
.editor >>> .CodeMirror {
  height: auto;
  min-height: 250px;
}
.editor >>> .CodeMirror-scroll {
  min-height: 250px;
}
.editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>