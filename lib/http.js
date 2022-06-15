// lib/http.js

// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * 翻译接口
 * @returns Promise
 */
async function translate(params) {
  return axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {params});
}

module.exports = {
  translate
}