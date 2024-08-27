<
<template>
  <el-row :gutter="20" id="indexHtml">
    <el-col :xs="0" :sm="0" :md="10" :lg="12" :xl="12">
      <div class="grid-content ep-bg-purple" />
      <div class="logoDiv">
        <img src="../assets/img/logo.png" alt="" id="logoImg" />
        <span class="text-20px font-bold">FAS</span>
      </div>
      <div class="loginBg">
        <img src="../assets/svg/login-box-bg.svg" key="1" alt="" />
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="12" id="loginForm">
      <div class="grid-content ep-bg-purple" />
      <div class="login">
        <!--设置卡片头部-->
        <!--通过header设置插槽，插槽最大的特点就是可以将html以及文本都放进去-->
        <!--插槽其实就是预留了位置-->
        <el-card class="login-card">
          <template #header>
            <div class="login-card-header">
              <span>用户登录</span>
            </div>
          </template>
          <!--卡片的body  表单里面的数据全部都是对象里面的数据-->
          <!-- ref设置后，在script中能使用this.$refs拿到对应的对象，用于验证和reset表单数据 -->
          <el-form :model="loginForm" ref="loginData">
            <!--这里的prop要跟rules里面的规则名对其用来校验规则-->
            <el-form-item prop="username">
              <!--refix-icon="UserFilled"图标做了全局引入，这里就不需要引入了-->
              <!--v-model.trim 其实双向绑定了loginData.username  trim其实就是去掉空格-->
              <!--placeholder 默认文字提示   placeholde 清除按钮-->
              <el-input
                prefix-icon="UserFilled"
                v-model.trim="loginForm.username"
                maxlength="32"
                placeholder="请输入账号"
                clearable
              >
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                type="password"
                prefix-icon="Lock"
                v-model.trim="loginForm.password"
                maxlength="16"
                placeholder="请输入密码"
                clearable
              >
              </el-input>
            </el-form-item>
            <!--这里面不需要加校验 因为只是一个按钮-->
            <!--style="width: 100%;border-radius: 5px;" 这里设置的样式 圆角-->
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%; border-radius: 5px"
                @click="loginBtnClick()"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, toRaw, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
//实体类
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  verifyCode: ''
})

const loginBtnClick = async () => {
  try {
    //post
    // const response = await axios.post('/Account/CheckLogin', {
    //   username: loginForm.username,
    //   password: loginForm.password
    // })
    //get
    // const response = await axios.get('/Account/CheckLogin', {
    //   params: {
    //     aUsername: loginForm.username,
    //     aPassword: loginForm.password
    //   }
    // })
    const response = await axios.get(
      '/Account/CheckLogin/' + loginForm.username + '/' + loginForm.password,
      {}
    )
    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>
<style scoped>
/* 添加你的样式 */
.logoDiv {
  margin: 3% 0 0 1%;
}
#logoImg {
  width: 48px;
}
.loginBg {
  /* height: calc(100% - 300px); */
  width: 70%;
  margin: 17% 0 17% 30%;
}
.login {
  position: absolute; /*图片平铺开来*/
}
#loginForm {
  align-items: center;
  display: flex;
}
.login-card {
  position: absolute;
  left: 5%;
  top: 0%;
  width: 450px;
}
.login-card {
  position: absolute;
  left: 5%;
  top: 0%;
  width: 450px;
}
#indexHtml{
  height: 100%;
}
@media (min-width: 1280px) and (max-width: 1535.9px) {
  .at-xl\:max-w-500px {
    max-width: 500px;
  }
}
</style>
