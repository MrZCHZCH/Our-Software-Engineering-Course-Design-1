<!--此文件为富编辑器组件-->
<template>
  <div ref='editor'></div>
  <button @click='syncHTML'>同步内容</button>
  <div :innerHTML='content.text'></div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import WangEditor from 'wangeditor';
export default {
  name: "WangEditorBar",
  setup() {
    const editor = ref();
    const content = reactive({
      text: '',
    });
    let instance;
    onMounted(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange() {
          console.log('change');
        },
      });
      instance.create();
    });
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    const syncHTML = () => {
      content.text = instance.txt.html();
    };
    return {
      syncHTML,
      editor,
      content,
    };
  },
}
</script>

<style scoped>

</style>