import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  Table,
  Space,
  Button,
  Tooltip,
  Menu,
  Dropdown,
  Popconfirm,
  Modal,
  message,
  Input,
  Select
} from 'antd';


import './index.css';
import { getSays } from '../../../redux/actions';
import { reqSaysList, reqAddAndUpdateSays, reqDeleteSay } from '../../../api/index';
import memoryUtils from '../../../utils/memoryUtils';

import TableNav from '../../../components/TableNav';


const Says = ({ says, getSays }) => {

  const user = memoryUtils.user

  // ————渲染表格数据 start ————
  // --表头数据--
  const columns = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 800,
      align: 'center',
      render: content => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      ),
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
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
          <Button type="primary" onClick={() => editSay(record)}>编辑</Button>
          <Popconfirm
            title="确定删除这条说说吗？"
            okText="确定"
            onConfirm={() => deleteSay(record._id)}
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
  const [saysShow, setSaysShow] = useState([]) /* 表格数据展示 */

  // 获取所有说说，并存入redux中
  const getAllSays = async () => {
    setTableLoading(true)
    const res = await reqSaysList()
    console.log(res);
    if (res.status === 0) {
      getSays(res.data)
      setTableLoading(false)
    }
  }

  // 组件挂载时将数据放入用于展示数据的 state 中
  useEffect(() => {
    getAllSays()
  }, [])

  // 将redux中的数据展示
  useEffect(() => {
    setSaysShow(says)
  }, [says])
  // ————渲染表格数据 end ————

  // ————————表格头部功能区 start ——————
  // --新建/更新说说--
  const { TextArea } = Input
  const [isModalVisible, setIsModalVisible] = useState(false) /* Modal框的显示状态 */
  const [saysContent, setSaysContent] = useState('') /* 文本框的内容 */
  const [isEdit, setIsEdit] = useState(false) /* 判断是否编辑模式 */
  const [sayId, setSayId] = useState('') /* 说说的id */
  // 打开编辑框
  const addSay = () => {
    setIsModalVisible(true)
    setIsEdit(false)
    setSaysContent('')
  }

  // redux中获取说说
  const getSaysFromRudex = id => {
    const sayObj = says.filter(item => item._id === id)[0]
    console.log('sayObj', sayObj);
    setSaysContent(sayObj.content)
  }

  // 点击修改的回调
  const editSay = say => {
    setIsModalVisible(true) /* 打开编辑框 */
    setIsEdit(true) /* 编辑模式 */
    console.log('修改', 'isEdit', isEdit);
    setSayId(say._id) /* 将id保存 */
    getSaysFromRudex(say._id) /* 将 redux中的数据取出来 */
  }
  // 提交说说
  const submitSay = async () => {
    if (user.role !== 'admin') {
      message.warning('只有管理员才可以发表说说哦~😁')
    } else {
      const content = saysContent
      const pubilshDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      let say
      if (isEdit) { // 如果是编辑模式，传入id
        const _id = sayId
        say = { _id, content, pubilshDate }
      } else {
        say = { content, pubilshDate }
      }
      const res = await reqAddAndUpdateSays(say)
      if (res.status === 0) {
        setIsModalVisible(false)
        getAllSays()
        message.success(`${isEdit ? '更新' : '添加'}说说成功！😀`)
      } else {
        setIsModalVisible(false)
        message.error('添加说说失败！😔')
      }
    }
  }

  // 删除说说
  const deleteSay = async id => {
   if(user.role !== 'admin') {
    message.warning('只有管理员才可以删除说说哦~😁')
   } else {
    const res = await reqDeleteSay(id)
    if (res.status === 0) {
      message.success('删除说说成功！😀')
      getAllSays()
    } else {
      message.error('删除说说失败！😔')
    }
   }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 修改表头的尺寸
  const [size, setSize] = useState('default')
  const getSize = (size) => {
    setSize(size)
  }

  return (
    <div className='says'>
      <div className='says-table'>
        {/* 表头功能区 */}
        <TableNav title='说说' addBtn={addSay} getSize={getSize} />
        {/* 表格主体内容 */}
        {/* 说说编辑卡片 */}
        <Modal title='修改用户' visible={isModalVisible} onOk={submitSay} onCancel={handleCancel}>
          <TextArea
            rows={4}
            placeholder="请输入内容~"
            allowClear
            showCount
            value={saysContent}
            onChange={e => setSaysContent(e.target.value)}
          />
        </Modal>
        <Table
          rowKey={record => record._id}
          columns={columns}
          dataSource={saysShow}
          size={size}
          bordered
          pagination={{
            size: 'small',
            total: says.length,
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

export default connect(
  state => ({
    says: state.says
  }),
  { getSays }
)(Says)