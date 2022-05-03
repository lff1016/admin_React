import React from 'react';
import { Button, Layout, Modal, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import {
  HomeOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';

import './index.css';
import memoryUtils from '../../../utils/memoryUtils';
import storageUtils from '../../../utils/storageUtils'


export default function Header() {

  const { Header } = Layout;
  const { confirm } = Modal;
  const navigate = useNavigate()

  // 退出登录
  const logout = () => {
    confirm({
      title: '确定退出吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        if(memoryUtils.user) {
          storageUtils.deleteUser()
          memoryUtils.user = {}
          message.success('退出成功!😀');
          // 重定向到登录页面
          navigate('/login')
        }
        console.log('用户已退出');
      }
    });
  }

  const toHome = () => {
    navigate('/home')
  }

  return (
    <Header className="header" style={{ padding: '8px 12px', backgroundColor: '#fff', height: '60px' }}>
      <div className='header-right'>
        {/* 点击去前台界面 */}
        <Button className='btn toHome' icon={<HomeOutlined />} onClick={toHome}>首页</Button>
        {/* 退出登录 */}
        <Button className='btn logout' icon={<LogoutOutlined />} onClick={logout}>
          退出
        </Button>
      </div>
    </Header>
  )
}
