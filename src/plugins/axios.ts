import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://192.168.32.60:7105',
  withCredentials: true, // 允许跨域请求时发送cookie
  timeout: 10000,
  headers: {
    //请求头，可以加上toekn等内容
    'Content-Type': 'application/json;charset=utf-8'
  },
  validateStatus(status) {
    //后端返回的状态码，是可选的参数，也可以不加
    return status == 200 ? true : false
  }
})

instance.interceptors.request.use(
  (config: any) => {
    return config
  },
  (error) => {
    //console.log(error)
    Promise.reject(error)
  }
)

//响应的内容
//根据自己的业务情况，同时也看后端的同事返回的数据结构来配置
instance.interceptors.response.use(
  (response: any) => {
    //响应成功
    const res = response.data
    return Promise.resolve(res)
  },
  (error: any) => {
    //响应失败
    let msg = {
      message: 'no data',
      data: 'none'
    }
    return Promise.reject(msg)
  }
)

export default instance
