import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Table,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message
} from 'antd';

import './index.css';
import { reqCommentsList, reqCommentVerify, reqCommentDelete } from '../../api/index';
import { getComments } from '../../redux/actions';
import TableNav from '../../components/TableNav';


const Comment = ({ comments, getComments }) => {

  // 渲染表格内容
  const [commentShow, setCommentShow] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  // --表头数据--
  const columns = [
    {
      title: '用户名',
      dataIndex: ['uid', 'username'],
      key: 'username',
      render: username => (
        <Tooltip placement="topLeft" title={username}>
          {username}
        </Tooltip>
      )
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: '15%',
      render: text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sorter: (a, b) => moment(a.publishDate) - moment(b.publishDate),
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend', 'ascend'] /* 禁止排序恢复到默认状态 */
    },
    {
      title: '状态',
      dataIndex: 'isShow', /* 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 */
      filters: [
        {
          text: '已通过',
          value: true,
          status: 'Error'
        },
        {
          text: '未审批',
          value: false
        }
      ],
      onFilter: (value, record) => record.isShow === value,
      render: (text, record) => {
        if (record.isShow) {
          return text = <span className='status-dot'><i className='status-dot-success'></i>已通过</span>
        } else {
          return text = <span className='status-dot'><i className='status-dot-fail'></i>未审批</span>
        }
      }
    },
    {
      title: '文章标题',
      dataIndex: ['aid', 'title'],
      key: 'article_title',
      render: article_title => (
        <Tooltip placement="topLeft" title={article_title}>
          {article_title}
        </Tooltip>)
    },
    {
      title: '回复用户',
      key: 'reply_user',
      dataIndex: 'replyId',
      // function(text, record, index) {}: 参数分别是：text: 当前行的值；record: 当前行的数据；index: 行索引
      render: (text, record) => (
        <Tooltip placement="topLeft">
          {record.replyId == "0" ? '否' : record.replyId.username}
        </Tooltip>)
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'comment_content',
      render: comment_content => (
        <Tooltip placement="topLeft" title={comment_content}>
          {comment_content}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editComment(record._id, record.isShow)}>{record.isShow ? '撤回' : '审批'}</Button>
          <Popconfirm
            title="确定删除文章吗？"
            onConfirm={() => { deleteComment(record._id) }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger>删除</Button>
          </Popconfirm>,
        </Space>
      ),
    },
  ]

  // —————— 获取评论数据 start ——————
  const getAllComments = async () => {
    setTableLoading(true)
    const res = await reqCommentsList()
    if (res.status === 0) {
      // 将数据放入 redux 中
      getComments(res.data)

      setCommentShow(getIdToUsername(res.data))
      // setReplyUser(getIdToUsername(res.data))
      setTableLoading(false)
    } else {
      message.error('获取评论失败')
    }
  }

  // 组件挂载时将评论数据放入 redux 中
  useEffect(() => {
    getAllComments()
  }, [])

  // 根据评论ID获取用户名
  const getIdToUsername = commentList => {
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].replyId !== "0") {
        let replyUserInfo = (commentList.find(item => item._id == commentList[i].replyId)).uid
        commentList[i].replyId = replyUserInfo
      }
    }
    return commentList
  }
// —————— 获取评论数据 end ——————

// —————— 评论操作 start ——————
// 审批
const editComment = async (_id, isShow) => {
  const res = await reqCommentVerify(_id, isShow)
  if(res.status === 0) {
    // 重新获取数据放入redux中
    getAllComments()
    message.success('审批通过！😀')
  } else {
    message.error('审批错误，请重试！😔')
  }
}

// 删除
const deleteComment = async _id => {
  const res = await reqCommentDelete(_id)
  if(res.status === 0) {
    getAllComments()
    message.success('删除评论成功！😀')
  } else {
    message.error('删除评论错误，请重试！😔')
  }
}

// —————— 评论操作 end ——————

// --修改尺寸数据 start--
const [size, setSize] = useState('default')
const getSize = (size) => {
  setSize(size)
}

return (
  <div className='comment'>
    {/* --表格内容开始-- */}
    <div className='data-table'>
      <TableNav title='评论' getSize={getSize} />
      <Table
        rowKey={record => record._id}
        columns={columns}
        dataSource={commentShow}
        size={size}
        bordered
        pagination={{
          size: 'small',
          total: comments.length,
          showQuickJumper: true,
          pageSize: 5, // 每页条数
          showTotal: (total, range) => `第${range[0]}-${range[1]}篇/总共${total}篇`,
        }}
        loading={tableLoading}
      />
    </div>
    {/* --表格内容结束-- */}
  </div>
)
};

export default connect(
  state => ({
    comments: state.comments
  }),
  { getComments }
)(Comment)

