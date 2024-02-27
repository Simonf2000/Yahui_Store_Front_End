/*
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 *
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:17:20
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useApp } from '@/pinia/modules/app'

const service = axios.create({
  baseURL: 'http://localhost:8501',    // 后端服务的ip地址和端口号
  timeout: 10000,
  withCredentials: true,
})

// 拦截请求
service.interceptors.request.use(
  config => {
    const { authorization } = useApp()   // 从Pinia的app模块中获取登录成功以后的用户数据
    if (authorization) {
        
      // 添加一个请求头Authorization ， 该请求头所对应的值为：Bearer token数据
      //config.headers.Authorization = `Bearer ${authorization.token}`
      
      // 上传传递方式后端解析太麻烦，因此可以更改传递token方式为如下方式
      config.headers.token = `${authorization.token}`
      
    }
    return config
  },
  error => {
    // console.log(error);
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
// 拦截响应
response => {		// service.interceptors.response.use第一个参数
  const res = response.data
  if (res.code == 208) {
      const redirect = encodeURIComponent(window.location.href)  // 当前地址栏的url
      router.push(`/login?redirect=${redirect}`)
      return Promise.reject(new Error(res.message || 'Error'))
  }
  return res 
}
)

export default service
