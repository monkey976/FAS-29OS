<template>
  <div class="bg-white mx-[10%] mt-[50px] p-[20px]">
    <div ref="editor" class="quill-editor"></div>
    <el-form class="contact-form">
      <el-form-item label="你的名字" required>
        <el-input v-model="name" placeholder="请输入你的名字" />
      </el-form-item>

      <el-form-item label="电子邮件" required>
        <el-input v-model="email" placeholder="请输入你的邮箱" />
      </el-form-item>

      <el-form-item label="留言" required>
        <el-input type="textarea" v-model="message" placeholder="请填写你的留言" />
      </el-form-item>

      <el-form-item class="submit-button">
        <div class="button-container">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // 引入样式

const editor = ref(null)
const name = ref('')
const email = ref('')
const message = ref('')

onMounted(() => {
  new Quill(editor.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'], // 字体样式
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'] // 链接和图片
      ]
    }
  })
})

const handleSubmit = () => {
  const content = editor.value.children[0].innerHTML // 获取编辑器内容
  console.log('姓名:', name.value)
  console.log('邮箱:', email.value)
  console.log('内容:', content)
}
</script>

<style scoped>
.quill-editor {
  height: 200px;
}

/* 将按钮容器设置为 flex，水平居中 */
.submit-button {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}
</style>
