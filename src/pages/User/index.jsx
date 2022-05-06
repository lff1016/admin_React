import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Input,
  Switch 
} from 'antd';
import moment from 'moment';

import { reqUsersList, reqUserAuth } from '../../api/index'

import TableNav from '../../components/TableNav';
import './index.css'

export default function User() {

  // ————表头数据————
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '10%',
      align: 'center',
      render: content => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      render: text => {
        if(text === 'admin') {
          return text = <Tag color="green">管理员</Tag>
        } else {
          return text = <Tag color="blue">普通用户</Tag>
        }
      }
    },
    {
      title: '启用',
      dataIndex: 'authority',
      key: 'authority',
      align: 'center',
      render: (text, record) => {
        return  <Switch defaultChecked={record.authority} onChange={() => changeAuthority(record._id, record.authority)} />
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sorter: (a, b) => moment(a.publishDate) - moment(b.publishDate),
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editUser(record)}>编辑</Button>
          <Popconfirm
            title="确定删除此用户吗？"
            okText="确定"
            onConfirm={() => deleteUser(record._id)}
            cancelText="取消"
          >
            <Button type="primary" danger>删除</Button>
          </Popconfirm>,
        </Space>
      ),
    },
  ]
  // --表格内容--
  const [tableLoading, setTableLoading] = useState(false) /* 表格loading */
  const [usersShow, setUsersShow] = useState([]) /* 表格数据展示 */

  // ————获取用户，并放入 state 中————
  const getAllUsers = async () =>{
    setTableLoading(true)
    const res = await reqUsersList()
    if(res.status === 0) {
      setUsersShow(res.data)
      setTableLoading(false)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  // ————对用户的编辑————
  const editUser = (userInfo) => {
    console.log(userInfo);
  }

  // ————用户删除————
  const deleteUser = id => {
    console.log('删除用户', id);
  }

  // ————用户权限控制————

  const changeAuthority = async (id, authority) => {
    const res = await reqUserAuth(id, authority)
    if(res.status === 0) {
      message.success(`${authority ? '禁用' : '启用'}用户成功！😀`)
      getAllUsers()
    } else {
      message.error(`${authority ? '禁用' : '启用'}用户失败！😔`)
    }
  }
  // 修改表头的尺寸
  const [size, setSize] = useState('default')
  const getSize = (size) => {
    setSize(size)
  }

  return (
    <div className='users'>
      <div className='users-table' getSize={getSize}>
        <TableNav title='用户'/>
        {/* 表格主体内容 */}
        <Table
          rowKey={record => record._id}
          columns={columns}
          dataSource={usersShow}
          size={size}
          bordered
          pagination={{
            size: 'small',
            total: `${usersShow.length}`,
            showQuickJumper: true,
            pageSize: 10, // 每页条数
            showTotal: (total, range) => `第${range[0]}-${range[1]}篇/总共${total}篇`,
          }}
          loading={tableLoading}
        />
      </div>
    </div>
  )
}
