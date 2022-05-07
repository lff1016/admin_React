import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Switch,
  Avatar,
  Form,
  Radio,
  Modal
} from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'

import { reqUsersList, reqUserAuth, reqDeleteUser, reqUserUpdate, reqUserEdit } from '../../api/index';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

import TableNav from '../../components/TableNav';
import './index.css';

export default function User() {

  // 获取用户信息
  let user = memoryUtils.user

  // ————表头数据————
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: '10%',
      align: 'center',
      render: text => (
        <Avatar className='user-avatar' size={40} src={`http://localhost:3001/upload/avatar/${text[0]}`} style={{ backgroundColor: '#fff' }} />
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
        if (text === 'admin') {
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
        return <Switch defaultChecked={record.authority} onChange={() => changeAuthority(record._id, record.authority)} />
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
          <Modal
            title="修改用户"
            visible={modalVisible}
            onOk={changeInfo}
            onCancel={handleCancel}
          >
            <div className='username'>
              用户名：<Input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className='user-role'>
              角色：
              <Radio.Group value={userRole} onChange={e => setUserRole(e.target.value)}>
                <Radio value='admin'>管理员</Radio>
                <Radio value='normal'>普通用户</Radio>
              </Radio.Group>
            </div>
          </Modal>

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
  const getAllUsers = async () => {
    setTableLoading(true)
    const res = await reqUsersList()
    if (res.status === 0) {
      setUsersShow(res.data)
      setTableLoading(false)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  // ————对用户的编辑————
  const [modalVisible, setModalVisible] = useState(false)
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('') /* 原本的用户名 */
  const [userRole, setUserRole] = useState('') /* 原本的角色 */
  // 填充 modal 
  const editUser = (userInfo) => {
    setModalVisible(true)
    console.log('userInfo', userInfo);
    setUsername(userInfo.username)
    setUserRole(userInfo.role)
    setUserId(userInfo._id)
  }

  // ————修改用户角色（只有admin才可以有修改的权限）————
  const changeInfo = async () => {
    if (user.role === 'admin') {
      const res = await reqUserEdit(userId, username, userRole)
      if (res.status === 0) {
        getAllUsers()
        message.success('修改用户成功！')
        setModalVisible(false)
      } else {
        message.error('更新用户信息失败！😔')
        setModalVisible(false)
      }
    } else {
      message.error('只有管理员才能修改哦~😀')
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  // ————用户删除————
  const navigate = useNavigate()
  const deleteUser = async id => {
    console.log('删除用户', id);
    const res = await reqDeleteUser(id)
    if (res.status === 0) {
      if (res.data._id === user._id) {
        // 如果删除的是正在登录的用户，就从localStorage中删除，并跳转到登录界面
        user = ''
        storageUtils.deleteUser()
        navigate('/login')
      }
      message.success('删除用户成功！😀')
    } else {
      message.error('删除用户失败！😔')
    }
  }

  // ————用户权限控制————

  const changeAuthority = async (id, authority) => {
    const res = await reqUserAuth(id, authority)
    if (res.status === 0) {
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
        <TableNav title='用户' />
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
