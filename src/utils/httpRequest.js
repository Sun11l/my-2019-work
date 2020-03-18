import axios from 'axios'
import store from '@/store'
import { getCookie } from '@/api/common/auth'
import { Message } from 'element-ui'
// import router from '@/router'

const service = axios.create({
  // timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // config.headers['Authorization'] = 'JWT ' + getCookie('token') // 请求头加token验证
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    console.log(response)
    if (response.status >= 200 && response.status < 300) {
      if (response.status === 204) {
        Message({
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
      }
      return response.data
    } else {
      Message({
        message: response.data || 'error',
        type: 'error',
        duration: 2000
      })
    }
  },
  error => {
    console.log(error.response)
    if (error.response && error.response.status === 401) {
      Message({
        type: 'error',
        message: '凭证过期，请重新登录',
        duration: 2000
      })
      store.dispatch('user/resetToken').then(() => {
        location.reload()
        // router.push('/login')
      })
    } else {
      console.log(error.response)
      error.response && errorCode(error)
    }
    console.log(error.response)
    return Promise.resolve(error.response)
  }
)

const errorCode = (error) => {
  console.log(error.response)
  const status = error.response.status
  switch (status) {
    case 404:
      return Message({
        message: '请求的文件资源在服务器上不存在',
        type: 'error',
        duration: 2000
      })
    case 406:
      return Message({
        message: '后台无法解析该文件, 请检查文件是否正确',
        type: 'error',
        duration: 2000
      })
    case 417:
      return Message({
        message: '密码修改失败',
        type: 'error',
        duration: 2000
      })
    case 500:
      return Message({
        message: (error.response && error.response.data.detail) || '服务器错误，请稍后重试',
        type: 'error',
        duration: 2000
      })
    case 504:
      return Message({
        message: '网络连接超时，请稍后重试',
        type: 'error',
        duration: 2000
      })
    case 403:
      return Message({
        message: '对不起您的权限不足，无法访问',
        type: 'error',
        duration: 2000
      })
    default:
      return Message({
        message: (error.response && error.response.data.detail) || '未知错误,请与管理员联系',
        type: 'error',
        duration: 2000
      })
  }
}

export default service
