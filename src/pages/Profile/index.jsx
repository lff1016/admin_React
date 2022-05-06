import React, { useState, useEffect, useRef } from 'react';
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

import memoryUtils from '../../utils/memoryUtils';
import { reqDeleteAvatar } from '../../api/index'

export default function Profile() {

  // 获取用户信息
  const user = memoryUtils.user

  const img = useRef()
  const formRef = useRef()

  const [form] = Form.useForm();

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
  const [imgUrl, setImgUrl] = useState('')
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
        setImgUrl(url)
      } else {
        message.error('上传图片失败！😔')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteAvatar(file.name)
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

  // 关闭预览
  const closeModal = () => {
    setPreviewVisible(false)
  }

  const handleConfirm = () => {
    console.log('修改');
  }

  return (
    <div className='profile'>
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
      // initialValues={{
      //   title: detailObj.title
      // }}
      >
        {/* 用户头像 */}
        <Form.Item label="头像">
          <Upload
            action="/api/admin/users/avatar" /* 图片提交的地址 */
            accept='image/*' /* 只接收图片格式 */
            name='avatar' /* 请求参数名 */
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
        {/* 用户名称 */}
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input />
        </Form.Item>
        {/* 用户邮箱*/}
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱!' }]}>
          <Input type='email' />
        </Form.Item>
        {/* 用户密码 */}
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password />
        </Form.Item>

        {/* 更新用户信息 */}
        <Form.Item
          className='submit-btn'
          wrapperCol={{
            span: 4,
            offset: 4,
          }}
        >
          {/* <Button type="primary" onClick={handleSubmit}>发布文章</Button> */}
          <Popconfirm
            title='修改'
            okText="确定"
            cancelText="取消"
            onConfirm={handleConfirm}
          >
            <Button type="primary">修改信息</Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </div>
  )
}
