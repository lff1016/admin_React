// 登录界面
import React from 'react';
import {Navigate,useNavigate} from 'react-router-dom';

import { Avatar, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// 登录的 api
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

import './index.css'

export default function Login() {
  const navigate = useNavigate()

  // 提交表单且数据验证成功后回调事件
  const onFinish = async (values) => {
    const {email, password} = values
    const res = await reqLogin(email, password)
    if(res.status === 0) { // 登陆成功
      message.success('登录成功', 3)
      console.log(res);
      const user = res.data
      // 保存用户信息
      memoryUtils.user = user
      storageUtils.saveUser(user)
      // 跳转至后台管理界面
      navigate('/')
    } else {
      message.error(res.msg)
    }
  };
  // 提交表单且数据验证失败后回调事件
  const onFinishFailed = (err) => {
    console.log(err);
  }

  // 在登录界面如果用户已经登录过，就直接跳转首页
  if (memoryUtils.user._id) {
    return <Navigate to="/"/>
  } else {
    return (
      <div className='login'>
        <section className='login-main'>
          <Avatar size={64} src='http://localhost:3001/upload/avatar/avatar-default-man.png' className='img-avter' />
          <div className='login-from'>            
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <h3 className='login-title'>用户登录</h3>
              {/* 用户名的表单框 */}
              <Form.Item
                name="email"
                rules={[
                  {required: true, message: '请输入你的邮箱!'},
                  {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱地址！'}
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>
              {/* 密码的表单框 */}
              <Form.Item
                name="password"
                rules={[
                  {required: true, message: '请输入你的密码!'},
                  {min: 4, message: '密码必须大于4位！'},
                  {max: 12, message: '密码必须小于12位！'},
                  {pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线！'}
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">忘记密码？</a>
              </Form.Item>
  
              <Form.Item>
                <Button type="primary" htmlType="submit" shape='round' className="login-form-button">
                  登录
                </Button>
                或 <a href="">现在注册!</a>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    )
  }
 
}
