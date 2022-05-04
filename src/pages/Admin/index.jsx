// 主界面
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import './index.css'
import LeftNav from '../../components/LeftNav';
import Main from '../../components/Main';

export default function Admin() {
  const user = memoryUtils.user

  if (!user._id) {
    return <Navigate to="/login" />
  } else {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 左边导航栏 */}
        <LeftNav/>
        {/* 右边主体部分 */}
        <Main/>
      </Layout>
    )
  }

}
