import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from "@/router";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
config.headers['accessToken'] = getToken()
    if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    // config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    //   if (response.status === 200) {
    //     return Promise.resolve(response);
    // }
    // if the custom code is not 20000, it is judged as an error.

    if (res.code === 200) {
      return Promise.resolve(response);
    }



    // if (res.code === 401) {
    //   router.push({ path: '/login' });
    // }

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 401) {
      // to re-login
      MessageBox.confirm('登录失效，您可以停留在此页面，或重新登录', '确认退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // store.dispatch('user/resetToken').then(() => {
        //   location.reload()
        // })
        router.push({ path: '/login' });
      })
    }
    return Promise.reject(new Error(res.message || 'Error'))
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
