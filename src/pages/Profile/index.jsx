import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { reqDeleteAvatar, reqUserUpdate, reqGetUser } from '../../api/index'
import { baseUrl } from '../../utils/contant'

export default function Profile() {

  // 获取用户信息
  const user = memoryUtils.user

  const img = useRef()
  const formRef = useRef()
  const [fileList, setFileList] = useState([])

  const [form] = Form.useForm();
  // ————编辑用户信息————
  const getUserInfo = () => {
    formRef.current.setFieldsValue({
      username: user.username,
      email: user.email,
      bio: user.bio
    })

    // 填充头像
    const user_avatar = user.avatar
    if (user_avatar && user_avatar.length > 0) {
      const newFileList = user_avatar.map((img, index) => (
        {
          useId: -index,
          name: img,
          status: 'done',
          url: `${baseUrl}/upload/avatar/` + img
        }
      ))
      setFileList(newFileList)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  // ————处理上传/删除图片 start ————


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
        console.log('请求的', url);
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
  //const [previewVisible, setPreviewVisible] = useState(false) /* 是否预览 */
  //const [previewImage, setPreviewImage] = useState('') /* 预览图片地址 */
  //const [previewTitle, setPreviewTitle] = useState('') /* 预览图片标题 */

/*   const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')))
  } */

  // 关闭预览
 /*  const closeModal = () => {
    setPreviewVisible(false)
  } */

  // ————提交用户修改信息————
  const handleSubmit = async () => {
    // 验证表单
    try {
      const values = await form.validateFields()
      // 收集数据，封装 user 对象
      const { username, bio } = values
      const avatar = img.current.fileList.map(file => file.name)
      const _id = user._id
      const newUser = { _id, username, bio, avatar }

      // 调用接口，更新信息
      const res = await reqUserUpdate(newUser)
      if (res.status === 0) {
        console.log(res.data);
        // 重新在内存中保存用户信息
        memoryUtils.user = res.data
        storageUtils.saveUser(res.data)
        message.success('更新用户信息成功！😀')
      } else {
        message.error('更新用户信息失败！😔')
      }
    } catch (err) {
      console.log('提交表单错误', err);

    }
  }

  console.log(fileList);

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
      >
        {/* 用户头像 */}
        <Form.Item label="头像">
          <Upload
            action="/api/admin/users/avatar" /* 图片提交的api地址 */
            accept='image/*' /* 只接收图片格式 */
            name='avatar' /* 请求参数名 */
            listType="picture-card" /* 卡片样式 */
            // fileList={fileList}
            showUploadList={false}
            // onPreview={handlePreview} /* 预览 */
            onChange={postImg}
            maxCount={1}
            ref={img}
          >
            {/* {fileList.length >= 1 ? null : uploadButton} */}
        
          {fileList.length !== 0 ? <img src={fileList[0].url}/> : uploadButton}
          </Upload>
{/*           <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={closeModal}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal> */}
        </Form.Item>
        {/* 用户名称 */}
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入你的用户名!' },
            { min: 2, message: '用户名必须大于1位！' },
            { max: 12, message: '用户名必须小于12位！' }
          ]}
        >
          <Input />
        </Form.Item>
        {/* 用户邮箱*/}
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱!' }]}>
          <Input type='email' disabled />
        </Form.Item>
        {/* 用户Bio*/}
        <Form.Item name="bio" label="签名" >
          <Input type='text' placeholder='请输入签名~' />
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
            title='确认提交用户修改信息吗？'
            okText="确定"
            cancelText="取消"
            onConfirm={handleSubmit}
          >
            <Button type="primary">修改信息</Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </div>
  )
}
