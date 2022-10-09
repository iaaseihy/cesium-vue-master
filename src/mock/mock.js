// 引入mockjs
import { LOGIN_URL } from '../constants/API'

import qs from 'qs'
const Mock = require('mockjs')

// 模拟登陆接口
Mock.mock(LOGIN_URL, (req, res) => {
  const item = qs.parse(req.body)
  const username = item.username
  const password = item.password
  if (username === 'admin' && password === '123456') {
    return {
      code: '200',
      msg: '登陆成功',
      data: {
        orgCode: '35002',
        token: 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiJhZG1pbiIsInVzZXJOYW1lIjoiYWRtaW4iLCJvcmdDb2RlIjoiMzUwMDAiLCJkZXB0Q29kZSI6IjM1MDAwIiwiYXVkIjoiYWRtaW4iLCJpc3MiOiJhZG1pbiIsImV4cCI6MTU5MzUzNTU5OH0.0pJAojRtT5lx6PS2gH_Q9BmBxeNlgBL37ABX22HyDlebbr66cCjVYZ0v0zbLO_9241FX9-FZpCkEqE98MQOyWw'
      }
    }
  } else {
    return {
      code: '999',
      msg: '登陆失败'
    }
  }
})
