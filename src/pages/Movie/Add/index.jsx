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
import { connect } from 'react-redux';

import { reqCountry, reqUpdateOrAddMovie } from '../../../api/index';
import memoryUtils from '../../../utils/memoryUtils';
import { movie_category } from '../../../utils/contant';
import { getMovies } from '../../../redux/actions'

const { Option } = Select;
const { TextArea } = Input;
/* 
 showAddDrawer: 是否显示弹框
 changeShowDrawer: 子组件通知父组件改变弹框状态的回调函数
 refreshMovieList: 子组件成功添加电影后更新 redux 中的数据
 editMovieNo: 修改电影时传入的编号
*/
const MovieAdd = ({ showAddDrawer, changeShowDrawer, refreshMovieList, editMovieNo, movies, getMovies }) => {

  /* 获取用户信息，判断是否为管理员 */
  const user = memoryUtils.user

  // 组件挂载时判断是否是编辑
  const [isEdit, setIsEdit] = useState(false)
  useEffect(() => {
    if (editMovieNo) {
      setIsEdit(true)
    }
  }, [editMovieNo])
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

  // ———— 添加/更新  电影 start ————
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


        /* 判断更新还是添加 */
        if (isEdit) {
          const movieNo = editMovieNo
          /* 增加 movieNo 字段*/
          movieObj.movieNo = movieNo
        }

        const res = await reqUpdateOrAddMovie(movieObj, isEdit)
        console.log('res', res);
        if (res.code === 0) {
          message.success(`${isEdit ? '更新' : '添加'}电影成功！😀`)
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

  // —————— 编辑电影信息 start ——————\


  useEffect(() => {
    if (isEdit) {
      getMovieFromRedux(editMovieNo)
    }
  }, [isEdit, editMovieNo])
  /* 修改表单的值 */

  /* 根据编号在 redux 中查询对应的信息 */
  const getMovieFromRedux = editMovieNo => {
    const movieObj = (movies.filter(item => item.movieNo === editMovieNo))[0]
    console.log(movieObj);
    const { movieName, countryAreaName, showYear, movieCategory, movieLink, movieScore, personalComment } = movieObj
    /* 填充表单 */
    form.setFieldsValue({
      movieName,
      countryAreaName,
      showYear: moment(showYear),
      movieCategory,
      movieLink,
      movieScore,
      personalComment
    })
  }
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
          <Button onClick={handleSubmit} type="primary">{isEdit ? '更新' : '添加'}</Button>
        </Space>

      }
    >
      <Form
        form={form}
        // ref={formRef}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{ movieScore: 6 }}
      >

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
            showArrowo
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
      </Form>
    </Drawer>
  )
}

export default connect(
  state => ({
    movies: state.movies
  }),
  getMovies
)(MovieAdd)

