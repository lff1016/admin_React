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
  Space,
  Tooltip
} from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

export default function MovieAdd() {

  const movieFromArea = ['内地', '香港', '台湾', '美国', '韩国', '日本', '泰国', '英国']

  const img = useRef()

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
  // const postImg = async ({ file, fileList }) => {
  //   // 一旦上传成功，将当前上传的 file 的信息改为{name, url}
  //   if (file.status === 'done') {
  //     const result = file.response  // {status: 0, data: {name: 'xxx,jpg', url: '图片地址'}} 
  //     if (result.status === 0) {
  //       message.success('上传图片成功！😀')
  //       const { path, name, url } = result.data
  //       file = fileList[fileList.length - 1]
  //       file.name = name
  //       file.url = url
  //     } else {
  //       message.error('上传图片失败！😔')
  //     }
  //   } else if (file.status === 'removed') {
  //     const result = await reqDeleteImg(file.name)
  //     if (result.status === 0) {
  //       message.success('删除图片成功！😀')
  //     } else {
  //       message.error('删除图片失败！😔')
  //     }
  //   }
  //   setFileList(fileList)
  // }
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

  // 添加文章
  const handleConfirm = () => {
    console.log('添加电影');
  }

  return (
    <div className='movie-add'>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
      >
        {/* 上传图片文件 */}
        <Form.Item label="封面图片">
          <Upload
            action="/api/admin/img/upload" /* 图片提交的地址 */
            accept='image/*' /* 只接收图片格式 */
            name='movieCover' /* 请求参数名 */
            listType="picture-card" /* 卡片样式 */
            fileList={fileList}
            onPreview={handlePreview} /* 预览 */
            // onChange={postImg}
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
        {/* 电影标题 */}
        <Form.Item
          name="title"
          label="电影名称"
          rules={[{ required: true, message: '请输入电影名称!' }]}
        >
          <Input />
        </Form.Item>
        {/* 电影地区 */}
        <Form.Item name="movieArea" label="地区"  rules={[{ required: true, message: '请选择电影所属地区!' }]}>
          <Select
            placeholder='请选择电影所属地区~'
            allowClear
            showArrow
          >
            {
              movieFromArea.map((area, index) => {
                return <Option key={index}>{area}</Option>
              })
            }
          </Select>
        </Form.Item>
        {/* 电影上映时间 */}
        <Form.Item
          name="movieYear"
          label="上映时间"
          rules={[{ required: true, message: '请选择电影上映时间!' }]}
        >
          <DatePicker picker="year" style={{ width: '100%' }} />
        </Form.Item>
        {/* 电影观看时间 */}
        <Form.Item name="movieWatchDate" label="观影时间" rules={[{ required: true, message: '请选择时间!' }]}>
          <DatePicker
            style={{ width: '100%' }}
            dateRender={current => {
              return (
                <div className="ant-picker-cell-inner">
                  {current.date()}
                </div>
              )
            }}
          />
        </Form.Item>
        {/* 电影分类 */}
        <Form.Item
          name="movieCategory"
          label="类型"
          rules={[{ required: true, message: '请输入电影的类型！' }]}
        >
          <Select
            mode="multiple"
            placeholder='请选择电影类型~'
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
                  />
                  <Typography.Link style={{ whiteSpace: 'nowrap' }}>
                    <PlusOutlined /> 添加分类
                  </Typography.Link>
                </Space>
              </>
            )}
          >
            <Option>1</Option>
            {/* {props.tags.map(item => {
              return <Option key={item._id}>{item.name}</Option>
            })} */}
          </Select>
        </Form.Item>
        {/* 观影地址 */}
        <Form.Item name="movieUrl" label="观影地址" rules={[{ required: true, message: '请输入电影网址！' }]}>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 32px)' }}
            />
            <Tooltip title="复制电影地址">
              <Button icon={<CopyOutlined />} />
            </Tooltip>
          </Input.Group>
        </Form.Item>
        {/* 电影简介 */}
        <Form.Item name="movieComment" label="简介"  rules={[{ required: true, message: '请输入电影简介!' }]}>
          <TextArea rows={4} placeholder="请输入电影简介" maxLength={100} showCount allowClear />
        </Form.Item>

        {/* 提交添加电影 */}
        <Form.Item
          className='submit-btn'
          wrapperCol={{
            span: 4,
            offset: 4,
          }}
        >
          {/* <Button type="primary" onClick={handleSubmit}>发布文章</Button> */}
          <Popconfirm
            title='确定添加吗？'
            okText="确定"
            cancelText="取消"
            onConfirm={handleConfirm}
          >
            <Button type="primary">添加电影</Button>
          </Popconfirm>
        </Form.Item>

      </Form>
    </div>
  )
}

