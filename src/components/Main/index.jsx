import React from 'react';
import { Route, Routes, Navigate,Outlet } from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd';

// import routers from '../../routers'
import Home from '../../pages/Home';
import Article from '../../pages/Articel/index';
import Edit from '../../pages/Articel/Edit/';
import Draft from '../../pages/Articel/Draft';
import Comment from '../../pages/Comment';
import User from '../../pages/User/index';
import Add from '../../pages/User/Add';
import Profile from '../../pages/Profile';

import './index.css'

export default function Main() {

  const { Header, Content, Footer } = Layout;

  // const element = useRoutes(routers)

  return (
    <Layout className="site-layout">
      <Header className="site-layout-background header" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0' }} className='content'>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <Routes>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/article' element={<Article/>}></Route>
            <Route path='/article/edit' element={<Edit/>}></Route>
            <Route path='/article/draft' element={<Draft/>}></Route>
            <Route path='/comment' element={<Comment/>}></Route>
            <Route path='/users' element={<User/>}></Route>
            <Route path='/users/add' element={<Add/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/' element={<Navigate to='/home'/>}></Route>
          </Routes>
          <Outlet/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2022 Created by LMD</Footer>
    </Layout>
  )
}
