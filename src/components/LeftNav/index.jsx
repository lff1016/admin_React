import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils';
import menuList from '../../config/menuConfig';
import { baseUrl } from '../../utils/contant'
import './index.css'

export default function LeftNav() {
  const { Sider } = Layout;
  const { SubMenu } = Menu;
  const user = memoryUtils.user

  // 获取当前路径
  const curPath = useLocation().pathname
  let  openKey
  let listNodes =  getMenuList(menuList)

  function getMenuList(menuList) {
    return menuList.map(item => {
      if (item.children) {
        // 判断当前子路由的路径和 path 是否相同，如果一样，就添加到展开数组
        if (item.children.find(cItem => curPath.indexOf(cItem.key) === 0)) {
          openKey = item.key
        }
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title} >
            {getMenuList(item.children)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item key={item.key} icon={item.icon} >
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        )
      }
    })
  }

  return (
    <Sider>
      <div className="logo" />
      <div className='logo-title'>
        <Avatar className='logo-avatar' size={64} src={`${baseUrl}/upload/avatar/${user.avatar[0]}`} style={{ backgroundColor: '#fff' }} />
        <h3 className='leftNav-info'>后台管理系统</h3>
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[curPath]} defaultOpenKeys={[openKey]}>
        {listNodes}
      </Menu>
    </Sider>
  )
}
