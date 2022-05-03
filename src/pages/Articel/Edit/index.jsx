import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Popconfirm, DatePicker, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

// 引入富文本编辑器
import RichEdit from '../../../components/RichEdit';
import { getArticles, getCategories, getTags } from '../../../redux/actions';
import { reqDeleteImg, reqAddOrUpdateArticle } from '../../../api/index'

const { Option } = Select;

const Edit = props => {

  const editor = useRef()
  const img = useRef()
  const formRef = useRef()
  const navigate = useNavigate()

  const [params, setParams] = useSearchParams() /* 获取路径参数 */
  const [isEdit, setIsEdit] = useState(false) /* 是否为编辑模式 */
  const [isDraft, setIsDraft] = useState(false) /* 是否为草稿 */
  const [id, setId] = useState('')
  const [detailObj, setDetailObj] = useState({})

  useEffect(() => {
    // 组件挂载时，判断是编辑还是添加
    console.log(params.get('a_status'));
    const edit = params.get('id') === null ? false : true
    if (edit) { // 编辑模式
      // 判断是否为草稿
      const flag = params.get('a_status') === 0+''
      console.log(flag);
      if (flag) { // 草稿
        setIsDraft(true)
      }
      setId(params.get('id'))
      setIsEdit(edit)
    }
  }, [params])


  // ————编辑时，从redux中获取文章 start ————
  const getDetailFromRedux = () => {
    const detailObj = props.articles.filter(item => item._id === id)[0]

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

    console.log(detailObj);
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

  // 编辑时，组件挂载就填入文章信息
  useEffect(() => {
    // 如果不是编辑页面，直接返回
    if (!isEdit) return
    getDetailFromRedux()
    // if (isDraft) { // 如果是草稿，向redux中获取草稿详情
    //   getDetailFromRedux(false)
    // } else { // 否则向redux中获取文章详情
    //   getDetailFromRedux(true)
    // }
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
        const { name, url } = result.data
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
  const statusRef = useRef()
  useEffect(() => {
    statusRef.current = artilceStatus
  })
  // ——保存并实时更新 草稿/文章 状态 end ——
  const handleSubmit = async (status) => {
    try {
      // 验证表单
      const values = await form.validateFields();
      // 收集数据，并封装成 article 对象
      const { title, publishDate, category, tags } = values
      const content = editor.current.getDetail()
      const coverImg = img.current.fileList.map(file => file.name)
      setArtilceStatus(status) /* 保存状态 */
      let article
      if (isEdit) { // 如果是编辑状态，将文章的id也包装到 article 对象中
        const _id = detailObj._id
        article = { _id, title, publishDate, category, tags, coverImg, status, content }
      } else {
        article = { title, publishDate, category, tags, coverImg, status, content }
      }

      console.log('文章', article)

      // 调用接口添加/更新文章
      const result = await reqAddOrUpdateArticle(article)

      if (result.status === 0) {
        console.log('isDraft',isDraft, 'isEdit', isEdit);
        if (statusRef.current === 1) {
          message.success(`${isEdit && !isDraft ? '更新' : '发布'}文章成功！😀`)
          // 跳转到文章列表页
          navigate('/article')
        } else {
          message.success('文章已存为草稿！😎')
          navigate('/article/draft')
        }

      } else {
        message.error(`${isEdit && !isDraft ? '更新' : '发布'}文章失败！😔`)
      }
    } catch (errorInfo) {
      console.log('提交表单错误！', errorInfo);
    }
  }

  // useEffect(() => {
    
  // }, [artilceStatus])


  console.log('isDraft',isDraft);
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
        initialValues={{
          title: detailObj.title
        }}
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
          <RichEdit ref={editor} key={detailObj.content} detail={detailObj.content} />
        </Form.Item>
        {/* 提交文章 */}
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
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
        </Form.Item>
        {/* 提交草稿 */}
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          {/* <Button type="primary" onClick={handleSubmit}>发布文章</Button> */}
          <Popconfirm
            title='确定存为草稿吗？'
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleSubmit(0)}
          >
            <Button type="primary">存为草稿</Button>
          </Popconfirm>
        </Form.Item>
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
  { getArticles, getCategories }
)(Edit)