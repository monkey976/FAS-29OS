<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile">Upload File</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TDModleUpload',
  setup() {
    const file = ref(null)

    const handleFileChange = (event) => {
      file.value = event.target.files[0]
    }

    const uploadFile = async () => {
      if (!file.value) {
        alert('No file selected')
        return
      }

      const formData = new FormData()
      formData.append('file', file.value)

      try {
        const response = await fetch('https://192.168.32.60:7105/3d_model/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        alert('File uploaded successfully')
        console.log(data)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    return {
      handleFileChange,
      uploadFile
    }
  }
}
</script>
