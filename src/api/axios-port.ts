import axios from 'axios'
import {ElMessage} from 'element-plus'

// 创建实例
let request = axios.create({})
// 请求拦截器
request.interceptors.request.use(config => {
    console.log(`request.interceptors.request >> ${config.url} | ${config.method} | ${config.params} | ${config.data}`)
    return config
}, error => {
    console.error(`request.interceptors.request >> ${error}`)
    return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(response => {
    console.log(`request.interceptors.response >> ${response}`)

    // 判断 业务code是不是200
    if (response.data.code !== 200) {
        ElMessage.error(response.data.msg)
        return Promise.reject(response.data.msg)
    }

    return response
}, error => { // 超出 2xx 范围的状态码都会触发该函数
    ElMessage.error(error.message)
    // console.dir(error)
    console.log(`request.interceptors.response >> ${error}`)
    return Promise.reject(error)
})

export default request

// 'Content-Type':'application/json;charset=utf-8'
// 'Content-Type':'application/x-www-form-urlencoded'
