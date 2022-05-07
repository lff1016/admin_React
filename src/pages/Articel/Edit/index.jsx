import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Popconfirm,
  DatePicker,
  message,
  Modal,
  Divider,
  Typography,
  Space
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

import './index.css'
// 引入富文本编辑器
// import RichEdit from '../../../components/RichEdit';
// 引入 markdown 编辑器
import Markdown from '../../../components/Markdown';
import { getArticles, getCategories, getTags } from '../../../redux/actions';
import {
  reqDeleteImg,
  reqAddOrUpdateArticle,
  reqAddCategory,
  reqCategoryList,
  reqAddTag,
  reqTagsList
} from '../../../api/index'

const { Option } = Select;

const Edit = props => {

  const img = useRef()
  const formRef = useRef()
  const navigate = useNavigate()

  const [params, setParams] = useSearchParams() /* 获取路径参数 */
  const [isEdit, setIsEdit] = useState(false) /* 是否为编辑模式 */
  const [isDraft, setIsDraft] = useState(false) /* 是否为草稿 */
  const [id, setId] = useState('')
  const [detailObj, setDetailObj] = useState({})
  const [content, setContent] = useState('')

  useEffect(() => {
    // 组件挂载时，判断是编辑还是添加
    const edit = params.get('id') === null ? false : true
    if (edit) { // 编辑模式
      // 判断是否为草稿
      const flag = params.get('a_status') === 0 + ''
      if (flag) { // 草稿
        setIsDraft(true)
      }
      setId(params.get('id'))
      setIsEdit(edit)
    }
  }, [params])


  // ————编辑时，从redux中获取文章 start ————
  const getDetailFromRedux = () => {
    const detailObj = props.articles.articlesList.filter(item => item._id === id)[0]

    // 将标签遍历出来放到数组中
    const TagsArr = detailObj.tags.map(item => item._id)

    setDetailObj(detailObj)
    // 修改表单的值
    formRef.current.setFieldsValue({
      title: detailObj.title,
      publishDate: moment(detailObj.publishDate),
      category: detailObj.category._id,
      tags: TagsArr
    })

    // 填充图片信息
    const coverImg = detailObj.coverImg
    if (coverImg && coverImg.length > 0) {
      const newFileList = coverImg.map((img, index) => ({
        uid: -index,
        name: img, /* 图片文件名 */
        status: 'done',
        url: 'http://localhost:3001/upload/' + img
      }))
      setFileList(newFileList)
    }
  }
  // 编辑时，获取md子组件传来的值
  const getHtmlContent = (val) => {
    setContent(val)
  }

  // 编辑时，组件挂载就填入文章信息
  useEffect(() => {
    // 如果不是编辑页面，直接返回
    if (!isEdit) return
    getDetailFromRedux()
  }, [isEdit])
  // ————编辑时，从redux中获取文章 end ————

  // ————处理上传/删除图片 start ————
  const [fileList, setFileList] = useState([])

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /* onChange事件：
  onChange({file, fileList, event}) 
   - file: 当前操作的文件对象
    -- {
        uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: 'xx.png'   // 文件名
        status: 'done', // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
        response: '{"status": "success"}', // 服务端响应内容
        linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
       }
    - fileList：当前的文件列表
    - event: 上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持
   */
  const postImg = async ({ file, fileList }) => {
    // 一旦上传成功，将当前上传的 file 的信息改为{name, url}
    if (file.status === 'done') {
      const result = file.response  // {status: 0, data: {name: 'xxx,jpg', url: '图片地址'}} 
      if (result.status === 0) {
        message.success('上传图片成功！😀')
        const { path, name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败！😔')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功！😀')
      } else {
        message.error('删除图片失败！😔')
      }
    }
    setFileList(fileList)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  // ————处理上传图片 end ————

  // ————处理图片预览 start ————
  const [previewVisible, setPreviewVisible] = useState(false) /* 是否预览 */
  const [previewImage, setPreviewImage] = useState('') /* 预览图片地址 */
  const [previewTitle, setPreviewTitle] = useState('') /* 预览图片标题 */

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')))
  }

  const closeModal = () => {
    setPreviewVisible(false)
  }
  // ————处理图片预览 end ————

  // ————处理提交文章 start ————
  const [form] = Form.useForm();
  // ——保存并实时更新 草稿/文章 状态 start ——
  const [artilceStatus, setArtilceStatus] = useState(0) /* 保存文章发表还是草稿的状态 */
  // 获取文章的状态
  const statusRef = useRef()
  useEffect(() => {
    statusRef.current = artilceStatus
  })
  // 分类模块
  const [categoryName, setCategoryName] = useState('')

  // 向数据库中获取所有分类，并放入redux中
  const getAllCategory = async () => {
    const res = await reqCategoryList()
    props.getCategories(res.data)
  }

  const addCategory = async e => {
    e.preventDefault();
    // 向数据库中添加分类
    const res = await reqAddCategory(categoryName)
    if (res.status === 0) {
      setCategoryName('')
      // 重新向 redux 中获取数据
      getAllCategory()
    }
  }

  // 添加标签
  const [tagName, setTagName] = useState('')
  // ————获取 Tags 数据，并放入 redux 中————
  const getAllTags = async () => {
    const res = await reqTagsList()
    props.getTags(res.data)
  }

  const addTag = async e => {
    e.preventDefault()
    // 向数据库中添加标签
    const res = await reqAddTag(tagName)
    if (res.status === 0) {
      setTagName('')
      getAllTags()
    }
  }

  // ——保存并实时更新 草稿/文章 状态 end ——
  const handleSubmit = async (status) => {
    try {
      // 验证表单
      const values = await form.validateFields();
      // 收集数据，并封装成 article 对象
      const { title, publishDate, category, tags } = values
      const coverImg = img.current.fileList.map(file => file.name)
      setArtilceStatus(status) /* 保存状态 */
      let article
      if (isEdit) { // 如果是编辑状态，将文章的id也包装到 article 对象中
        const _id = detailObj._id
        article = { _id, title, publishDate, category, tags, coverImg, status, content }
      } else {
        article = { title, publishDate, category, tags, coverImg, status, content }
      }

      // 调用接口添加/更新文章
      const result = await reqAddOrUpdateArticle(article)

      if (result.status === 0) {
        if (statusRef.current === 1) {
          message.success(`${isEdit && !isDraft ? '更新' : '发布'}文章成功！😀`)
          // 跳转到文章列表页
          navigate('/article')
        } else {
          message.success('文章已存为草稿！😎')
          navigate('/article')
        }

      } else {
        message.error(`${isEdit && !isDraft ? '更新' : '发布'}文章失败！😔`)
      }
    } catch (errorInfo) {
      console.log('提交表单错误！', errorInfo);
    }
  }
  // ————处理提交文章 end ————


  return (
    <div className='edit'>
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        ref={formRef}
      >
        {/* 文章标题 */}
        <Form.Item
          name="title"
          label="文章标题"
          rules={[{ required: true, message: '请输入文章标题!' }]}
        >
          <Input />
        </Form.Item>
        {/* 文章时间 */}
        <Form.Item name="publishDate" label="时间" rules={[{ required: true, message: '请选择时间!' }]}>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            showNow
            placeholder='选择时间'
          />
        </Form.Item>
        {/* 文章分类 */}
        <Form.Item name="category" label="分类" rules={[{ required: true, message: '请输入分类!' }]}>
          <Select
            placeholder='请选择文章分类~'
            allowClear
            showArrow
            showSearch
            dropdownRender={menu => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space align="center" style={{ padding: '0 8px 4px' }} className='add'>
                  <Input
                    style={{ width: '300px' }}
                    placeholder="请输入新的分类~"
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                  />
                  <Typography.Link onClick={addCategory} style={{ whiteSpace: 'nowrap' }}>
                    <PlusOutlined /> 添加分类
                  </Typography.Link>
                </Space>
              </>
            )}
          >
            {
              props.categories.map(item => {
                return <Option key={item._id}>{item.name}</Option>
              })
            }

          </Select>
        </Form.Item>
        {/* 文章标签 */}
        <Form.Item
          name="tags"
          label="标签"
          rules={[{ required: true, message: '请输入标签！' }]}
        >
          <Select
            mode="multiple"
            placeholder='请选择文章标签~'
            allowClear
            showArrow
            dropdownRender={menu => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space align="center" style={{ padding: '0 8px 4px' }} className='add'>
                  <Input
                    style={{ width: '300px' }}
                    placeholder="请输入新的分类~"
                    value={tagName}
                    onChange={e => setTagName(e.target.value)}
                  />
                  <Typography.Link onClick={addTag} style={{ whiteSpace: 'nowrap' }}>
                    <PlusOutlined /> 添加分类
                  </Typography.Link>
                </Space>
              </>
            )}
          >
            {props.tags.map(item => {
              return <Option key={item._id}>{item.name}</Option>
            })}
          </Select>
        </Form.Item>
        {/* 上传图片文件 */}
        <Form.Item label="封面图片">
          <Upload
            action="/api/admin/img/upload" /* 图片提交的地址 */
            accept='image/*' /* 只接收图片格式 */
            name='coverImg' /* 请求参数名 */
            listType="picture-card" /* 卡片样式 */
            fileList={fileList}
            onPreview={handlePreview} /* 预览 */
            onChange={postImg}
            maxCount={1}
            ref={img}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={closeModal}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form.Item>
        {/* 文章内容 */}
        <Form.Item name="content" label="内容">
          {/* <RichEdit ref={editor} key={detailObj.content} detail={detailObj.content} /> */}
          <Markdown
            key={detailObj.content}
            detail={detailObj.content}
            getContent={getHtmlContent}
          />
          {/* <MdEditor
            value={mdValue}
            onChange={handleEditorChange}
            renderHTML={text => mdParser.render(text)}
            style={{ height: 400 }}
          >
          </MdEditor> */}
        </Form.Item>
        {/* 提交文章 */}
        <Form.Item
          className='submit-btn'
          wrapperCol={{
            span: 4,
            offset: 4,
          }}
        >
          {/* <Button type="primary" onClick={handleSubmit}>发布文章</Button> */}
          <Popconfirm
            title={`确定${isEdit && !isDraft ? '更新' : '发布'}文章吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleSubmit(1)}
          >
            <Button type="primary">{isEdit && !isDraft ? '更新' : '发布'}文章</Button>
          </Popconfirm>
          <Popconfirm
            title='确定存为草稿吗？'
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleSubmit(0)}
          >
            <Button type="primary" style={{ marginLeft: '8px' }}>存为草稿</Button>
          </Popconfirm>
        </Form.Item>
        {/* 提交草稿 */}

      </Form>
    </div>
  )
}

export default connect(
  state => ({
    tags: state.tags,
    categories: state.categories,
    articles: state.articles
  }),
  { getArticles, getCategories, getTags }
)(Edit)