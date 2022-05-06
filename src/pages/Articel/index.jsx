import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Input,
  Select
} from 'antd';

import './index.css';
import { reqArticles, reqDeleteArticel } from '../../api/index';
import { getArticles, getCategories } from '../../redux/actions';
import isContained from '../../utils/isContained';
import TableNav from '../../components/TableNav';

const Article = ({
  articles,
  categories,
  tags,
  getArticles,
  getCategories
}) => {
  const { Option } = Select;
  const navigate = useNavigate()

  // ————————渲染表格内容 start ——————
  const [articelShow, setArticelShow] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  // --表头数据--
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width:'30%',
      render: title => (
        <Tooltip placement="topLeft" title={title}>
          {title}
        </Tooltip>
      ),
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: '15%',
      render:  text => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sorter: (a, b) =>  moment(a.publishDate) - moment(b.publishDate),
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend', 'ascend'] /* 禁止排序恢复到默认状态 */
    },
    {
      title: '状态',
      dataIndex: 'status', /* 列数据在数据项中对应的路径，支持通过数组查询嵌套路径 */
      filters: [
        {
          text: '已发表',
          value: 1,
          status: 'Error'
        },
        {
          text: '草稿',
          value: 0
        }
      ],
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        if(record.status === 0) {
          return text =<span className='status-dot'><i className='status-dot-draft'></i>草稿</span>
        } else {
          return text = <span className='status-dot'><i className='status-dot-articel'></i>已发表</span>
        }
      }
    },
    {
      title: '分类',
      dataIndex: ['category','name'],
      key: 'category'
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map((tag, index) => {
            const color = ['geekblue', 'green', 'red', 'orange', 'cyan', 'volcano', 'purple']
            return (
              <Tag color={color[index]} key={tag._id}>{tag.name}</Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '文章Url',
      dataIndex: 'articelUrl',
      key: 'articelUrl',
      render: articelUrl => (
        <Tooltip placement="topLeft" title={articelUrl}>
          <a href=''>网址</a>
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
          <Button type="primary" onClick={() => editArticle(record._id, record.status)}>编辑</Button>
          <Popconfirm
            title="确定删除文章吗？"
            onConfirm={() => {deleteArticle(record._id)}}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger>删除</Button>
          </Popconfirm>,
        </Space>
      ),
    },
  ];
 
  // 获取文章
  const getAllArticles = async () => {
    setTableLoading(true)
    const res = await reqArticles()
    // 将数据放到 redux中
    getArticles(res.data)
    setTableLoading(false)
  }
  // 组件挂载时将数据放在 state中
  useEffect(() => {
    getAllArticles()
  }, [])

  useEffect(() => {
    // 将 redux中的文章数据展示出来
    setArticelShow(articles.articlesList)
  }, [articles])
  // ————————渲染表格内容 end ——————

  // ————————搜索栏 start ——————
  // ————————根据输入内容搜索 start ——————
  const [searchTags, setSearchTags] = useState([])
  const [searchCategory, setSearchCategory] = useState(null)
  const searchWords = useRef()
  const searchByWord = (e) => {
    // 初始化关键词和分类搜索
    setSearchCategory(null)
    setSearchTags([])
    const keyWords = e.target.value.toLowerCase()

    // 如果输入内容是空的，就展示所有文章
    if (!keyWords) {
      setArticelShow(articles)
      return
    }
    // 过滤出要搜索的文章
    const newArticelShow = articles.filter(item => item.title.toLowerCase().indexOf(keyWords) !== -1)
    console.log(newArticelShow);

    // 将要展示的文章放进展示列表
    setArticelShow(newArticelShow)
  }
  // ————————根据输入内容搜索 end ——————

  // ————————根据标签搜索 start ——————
  const searchByTags = tagsArray => {
    // 将按关键字和分类搜索框的内容设为空
    searchWords.current.input.value = ''
    setSearchCategory(null)

    if(tagsArray.length === 0) {
      setArticelShow(articles)
      return
    }

    const a_len = articles.length
    const articlesByTags = []
    for(let i = 0; i < a_len; i++) {
      if(isContained(articles[i].tags, tagsArray)) {
        articlesByTags.push(articles[i])
      }
    }
    setArticelShow(articlesByTags)
  }
  // ————————根据标签搜索 end ——————

  // ————————根据分类搜索 start ——————
  const searchByCategory = category => {
    searchWords.current.input.value = ''
    setSearchTags([])

    if(!category) {
      setArticelShow(articles)
      return
    }
    
    // 过滤出要搜索的文章
    const newArticelShow = articles.filter(item => {
      return item.category.name === category
    })
    setArticelShow(newArticelShow)
  }

  // ————————根据分类搜索 end ——————
  // ————————搜索栏 end ——————

  // ————————对文章的操作 start ———————
  // 修改文章
  const editArticle = (id, status) => {
    // 跳转到文章编辑界面
    navigate(`/article/edit?id=${id}&a_status=${status}`)
  }
  
  // 添加文章
  const turnAddArticle = () => {
    navigate('/article/edit')
  }

  // 删除文章
  const deleteArticle = async id => {
    const res = await reqDeleteArticel(id)
    if(res.status === 0 ) {
      getAllArticles()
      message.success('删除文章成功！😀')
    } else {
      message.error('删除文章失败！😔')
    }
  }
  // ————————对文章的操作 end ———————

  // ————————表格头部功能区 start ——————
  // --修改尺寸数据 start--
  const [size, setSize] = useState('default')
  const getSize = (size) => {
    setSize(size)
  }
  // ————————表格头部功能区 end ————————

  return (
    <div className='article'>
      {/* --筛选栏开始-- */}
      <div className='condition-filter'>
        <div className='searchByWords'>
          标题：
          <Input ref={searchWords} type='text' style={{ width: 350 }} placeholder='输入文章标题' onChange={searchByWord} />
        </div>
        <div className='searchByTags'>
          标签：
          <Select 
            mode="multiple" 
            style={{ width: 350 }} 
            placeholder='请选择文章标签~' 
            allowClear
            showArrow
            value={searchTags}
            onChange={value => {
              searchByTags(value)
              setSearchTags(value)
            }}
          >
            {tags.map(item => {
              return  <Option key={item._id}>{item.name}</Option>
            }) }
          </Select>
        </div>
        <div className='searchByClass'>
          分类：
          <Select 
            style={{ width: 350 }} 
            placeholder='请选择文章分类~' 
            allowClear
            showArrow
            showSearch
            value={searchCategory}
            onChange={value => {
              searchByCategory(value)
              setSearchCategory(value)
            }}
          >
            {
              categories.map(item => {
                return <Option value={item.name} key={item._id}>{item.name}</Option>
              })
            }
          </Select>
        </div>
      </div>
      {/* --筛选栏结束-- */}
      {/* --表格内容开始-- */}
      <div className='data-table'>
        <TableNav  title='文章' addBtn={turnAddArticle} getSize={getSize}/>
        <Table
          rowKey={record => record._id}
          columns={columns}
          dataSource={articelShow}
          size={size}
          bordered
          pagination={{
            size: 'small',
            total: articles.length,
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
    tags: state.tags,
    categories: state.categories,
    articles: state.articles
  }),
  { getArticles, getCategories }
)(Article)
