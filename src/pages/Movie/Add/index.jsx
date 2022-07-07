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
  Rate,
  Drawer,
  Space
} from 'antd';
import moment from 'moment';

import { reqAddMovie, reqCountry } from '../../../api/index';
import memoryUtils from '../../../utils/memoryUtils';
import { movie_category } from '../../../utils/contant';

const { Option } = Select;
const { TextArea } = Input;
/* 
 showAddDrawer: 是否显示弹框
 changeShowDrawer: 子组件通知父组件改变弹框状态的回调函数
 refreshMovieList: 子组件成功添加电影后更新 redux 中的数据
 editMovieInfo: 修改电影时传入的初始值
*/
export default function MovieAdd({showAddDrawer, changeShowDrawer, refreshMovieList, editMovieInfo}) {

  /* 获取用户信息，判断是否为管理员 */
  const user = memoryUtils.user

  // const img = useRef()

  // —————— 获取电影的国家列表 start ——————
  /* 国家数组 */
  // const countryList = [{countryAreaNo: 1, countryAreaName: '日本'}]
  const [country, setCountry] = useState([])
  const getCountry = async () => {
    const res = await reqCountry()
    if (res.code === 0) {
      setCountry(res.info.records)
    }
  }
  useEffect(() => {
    getCountry()
  }, [])
  // —————— 获取电影的国家列表 end ——————

  // ————处理上传/删除图片 start ————
 /*  const [fileList, setFileList] = useState([])

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  } */

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
  /*   const postImg = async ({ file, fileList }) => {
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
    } */
/*   const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  ); */
  // ————处理上传图片 end ————

  // ————处理图片预览 start ————
  // const [previewVisible, setPreviewVisible] = useState(false) /* 是否预览 */
  // const [previewImage, setPreviewImage] = useState('') /* 预览图片地址 */
  // const [previewTitle, setPreviewTitle] = useState('') /* 预览图片标题 */

/*   const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')))
  }

  const closeModal = () => {
    setPreviewVisible(false)
  } */
  // ————处理图片预览 end ————

  // ———— 添加电影 start ————
  const [form] = Form.useForm()
  const handleSubmit = async () => {
    if (user.role !== 'admin') {
      message.warning('只有管理员才可以添加/修改电影！😀')
    } else {
      try {
        /* 验证表单 */
        const movieObj = await form.validateFields()
        movieObj.showYear = moment(movieObj.showYear).format('YYYY')
        console.log(movieObj);
        const res = await reqAddMovie(movieObj)
        console.log('res', res);
        if (res.code === 0) {
          message.success('添加电影成功！😀')
          refreshMovieList()
          /* 关闭添加弹窗 */
          changeShowDrawer()
        } else {
          message.error('添加电影失败' + res.msg)
        }
      } catch (errInfo) {
        console.log('提交电影表单错误！', errInfo);

      }
    }
  }
  // ———— 添加电影 end ————

  // —————— 编辑电影信息 start ——————
  /* 修改表单的值 */
  const formRef = useRef()
  formRef.current.setFieldsValue(editMovieInfo)
  // —————— 编辑电影信息 end ——————

  return (
    <Drawer
        title="添加电影"
        width={720}
        onClose={() => changeShowDrawer()}
        visible={showAddDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={() => changeShowDrawer()}>取消</Button>
            <Button onClick={handleSubmit} type="primary">添加</Button>
          </Space>
          
        }
      >
        <Form
        form={form}
        ref={formRef}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{ movieScore: 6 }}
      >
        {/* 上传图片文件 */}
{/*         <Form.Item label="封面图片">
          <Upload
            action="/api/admin/img/upload"
            accept='image/*' 
            name='movieCover'
            listType="picture-card" 
            fileList={fileList}
            onPreview={handlePreview} 
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
        </Form.Item> */}

        {/* 电影标题 */}
        <Form.Item
          name="movieName"
          label="电影名称"
          rules={[{ required: true, message: '请输入电影名称!' }]}
        >
          <Input />
        </Form.Item>

        {/* 电影地区 */}
        <Form.Item name="countryAreaNo" label="地区" rules={[{ required: true, message: '请选择电影所属地区!' }]}>
          <Select
            placeholder='请选择电影所属地区~'
            allowClear
            showArrow
          >
            {
              country.map((area, index) => (<Option key={area.countryAreaNo} value={area.countryAreaNo}>{area.countryAreaName}</Option>))
            }
          </Select>
        </Form.Item>

        {/* 电影上映时间 */}
        <Form.Item
          name="showYear"
          label="上映时间"
          rules={[{ required: true, message: '请选择电影上映时间!' }]}
        >
          <DatePicker
            picker="year"
            style={{ width: '100%' }}
            format='YYYY'
          />
        </Form.Item>

        {/* 电影观看时间 */}
        {/* <Form.Item name="movieWatchDate" label="观影时间" rules={[{ required: true, message: '请选择时间!' }]}>
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
        </Form.Item> */}

        {/* 电影分类 */}
        <Form.Item
          name="movieCategory"
          label="类型"
          rules={[{ required: true, message: '请输入电影的类型！' }]}
        >
          <Select
            placeholder='请选择电影类型~'
            allowClear
            showArrow
          >
            {
              movie_category.map(item => (<Option value={item.code} key={item.code}>{item.name}</Option>))
            }
          </Select>
        </Form.Item>

        {/* 观影地址 */}
        <Form.Item name="movieLink" label="观影地址" rules={[{ required: true, message: '请输入电影网址！' }]}>
          <Input />
          {/* <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 32px)' }}
            />
            <Tooltip title="复制电影地址">
              <Button icon={<CopyOutlined />} />
            </Tooltip>
          </Input.Group> */}
        </Form.Item>

        {/* 电影评分 */}
          <Form.Item className='score-pannel' name="movieScore" label="自评分数" rules={[{ required: true, message: '请选择评分！' }]}>
            <Rate
              style={{ paddingBottom: '3px' }}
              allowHalf
              count={10}
            />

          </Form.Item>

        {/* 电影简介 */}
        <Form.Item name="personalComment" label="简介" rules={[{ required: true, message: '请输入电影简介!' }]}>
          <TextArea rows={4} placeholder="请输入电影简介" maxLength={100} showCount allowClear />
        </Form.Item>

        {/* 提交添加电影 */}
{/*         <Form.Item
          className='submit-btn'
          wrapperCol={{
            span: 4,
            offset: 4,
          }}
        >
          <Popconfirm
            title='确定添加吗？'
            okText="确定"
            cancelText="取消"
            onConfirm={handleConfirm}
          >
            <Button type="primary">添加电影</Button>
          </Popconfirm>
        </Form.Item> */}

      </Form>
        </Drawer>
  )
}

