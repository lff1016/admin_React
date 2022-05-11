import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className='app'>
      {/* 使用路由 */}
      <Routes>
        {/* 登录界面 */}
        <Route path='/login' element={<Login/>}></Route>
        {/* 主页 */}
        <Route path='/*' element={<Admin/>}></Route>
      </Routes>
    </div>
  )
}
