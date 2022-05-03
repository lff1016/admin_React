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

import Header from './Header';

import './index.css';


export default function Main() {

  const { Content, Footer } = Layout;

  return (
    <Layout className="site-layout">
      <Header/>
      <Content style={{ margin: '12px 16px 0',padding: '10px 10px', backgroundColor: '#f0f2f5' }} className='content'>
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
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>Ant Design ©2022 Created by LMD</Footer>
    </Layout>
  )
}
