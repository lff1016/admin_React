// 主界面
import React from 'react';
import memoryUtils from '../../utils/memoryUtils';
import './index.css'

export default function Admin() {
  const user = memoryUtils.user
  return (
    <div className='admin'>
      hello {user.username}
    </div>
  )
}
