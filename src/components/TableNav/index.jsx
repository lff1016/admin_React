/* 表头组件 */
import React, {useState} from 'react';
import {
  Button,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  ColumnHeightOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './index.css'

export default function TableNav(props) {
  const {title, addBtn, getSize} = props

  // --修改尺寸数据 start --
  const [size, setSize] = useState('default')

  const handleSize = ({ key }) => {
    setSize(key)
    getSize(key)
  }
  // 表格尺寸的每一项
  const menu = (
    <Menu onClick={handleSize} selectedKeys={[size]}>
      <Menu.Item key="default"><span>默认</span></Menu.Item>
      <Menu.Item key="middle"><span>中等</span></Menu.Item>
      <Menu.Item key="small"><span>紧凑</span></Menu.Item>
    </Menu>
  )
  // --修改尺寸数据 end --

  return (
    <div className='table-title'>
      <div className='says-list'>{title}列表</div>
      {/* 表格设置，新建/刷新/适应 */}
      <div className='table-set'>
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          size='large'
          onClick={addBtn}
        >
          新建
        </Button>
        {/* 刷新 */}
        <Tooltip placement="top" title='刷新'>
          <span className='reload'><ReloadOutlined /></span>
        </Tooltip>
        {/* 改变表格样式 */}
        <Dropdown overlay={menu} trigger={['click']} placement='bottomLeft' overlayStyle={{ 'width': '70px' }}>
          <Tooltip placement="top" title='密度'>
            <span className='tabel-size'><ColumnHeightOutlined /></span>
          </Tooltip>
        </Dropdown>
      </div>
    </div>
  )
}
