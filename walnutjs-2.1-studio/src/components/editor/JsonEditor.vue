<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { EditorView } from '@codemirror/view';
import { getEditorState } from './useCodeMirror';
import { useJsonConfigStore } from '../../stores/jsonConfig';
import { ref } from 'vue';

let editorView;

const jsonConfigStore = useJsonConfigStore();
const editorElement = ref();


const updateDocument = () => {
  editorView.dispatch({changes: {
    from: 0,
    to: editorView.state.doc.length,
    insert: JSON.stringify(jsonConfigStore.json, null, 2),
  }});
}

onMounted(() => {
  editorView = new EditorView({
    state: getEditorState(jsonConfigStore),
    parent: editorElement.value,
  });
});

onUnmounted(() => {
  editorView.destroy();
});

</script>

<template>
  <button @click="updateDocument">update document</button>
  <div id="editor" ref="editorElement"/>
</template>

<style scoped>
#editor {
  height: 100%;
  margin: auto;
  overflow-y: scroll;
}
</style>
