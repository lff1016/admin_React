import React, { useState, useEffect } from 'react';
import { Modal, Input, Popconfirm, Button, List, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import './index.css';
import { getArticles, getCategories } from '../../redux/actions';
import { reqCategoryList, reqAddCategory, reqDeleteCategory, reqUpdateCategory, reqArticles } from '../../api/index'


const Category = props => {

  // 向数据库中获取所有分类，并放入redux中
  const getAllCategory = async () => {
    const res = await reqCategoryList()
    props.getCategories(res.data)
  }

  // 向数据库中获取所有的文章，并放入redux中
  const getAllArticles = async () => {
    const res = await reqArticles()
    props.getArticles(res.data)
  }
  useEffect(() => {
    getAllCategory()
  }, [])

  useEffect(() => {
    getAllArticles()
  }, [])




  // ————添加分类操作————
  const [categoryInput, setCategoryInput] = useState('')
  const addCategory = async () => {
    reqAddCategory(categoryInput)
      .then(res => {
        if(res.status === 0) {
          setCategoryInput('')
          message.success('添加分类成功！😀')
          getAllCategory()
        }
      })
  }
  // ————删除文章的分类操作————
  // const deleteCategoryForm = async (id, category) => {
  //   reqUpdateCategory(id, category)
  // }

  const deleteCategory = async (id, category) => {
    console.log('删除分类', id, category);
    reqDeleteCategory(id, category)
      .then(res => {
        if(res.status === 0) {
          message.success('删除分类成功！😀')
          getAllCategory()
        }
      })
  }

  // ———— 修改 Modal框————
  // Modal框是否显示
  const [categoryEditVisable, setCategoryEditVisable] = useState(false)
  const [categoryId, setCategoryId] = useState('')

  const showModal = (id, oldCategoryName) => {
    // 输入框的值
    setCategoryEditInput(oldCategoryName)
    // 旧类名的 id
    setCategoryId(id)
    setCategoryEditVisable(true)
  }

  // ————修改分类————
  // 修改Input框中的值
  const [categoryEditInput, setCategoryEditInput] = useState('')
  // 确认修改的回调
  const editCategory = () => {
    reqUpdateCategory(categoryId, categoryEditInput)
      .then(res => {
        if(res.status === 0) {
          setCategoryEditInput('')
          setCategoryId('')
          setCategoryEditVisable(false)
          message.success('修改分类成功')
          // 重新获取分类存入 redux
          getAllCategory()
        }
      })
  }

  // 取消修改的回调
  const editCategoryCancle = () => {
    console.log('取消修改');
    setCategoryEditVisable(false)
  }

  return (
    <div className='card category'>
      <div className='category-title'>分类</div>
      <div className='category-add'>
        <Input
          type='text'
          placeholder='请输入新的分类~'
          onKeyUp={e => { if (e.keyCode === 13) addCategory() }}
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
        />
        <Button type='primary' onClick={addCategory}>添加</Button>
      </div>
      <div className='category-list'>
        <Modal
          title='修改分类'
          centered // 垂直居中展示 Modal
          visible={categoryEditVisable}
          onOk={editCategory}
          onCancel={editCategoryCancle}
          width={400}
          okText='确认'
          cancelText='取消'
        >
          <Input
            type='text'
            className='editCategoryInput'
            value={categoryEditInput}
            onKeyUp={e => { if (e.keyCode === 13) editCategory() }}
            onChange={e => setCategoryEditInput(e.target.value)} // 将修改分类存入状态
          />
        </Modal>
        <List
          dataSource={props.categories}
          renderItem={item => (
            <List.Item className='category-item'>
              <div className='category-item-count'>
                <span className='count'>{item.c_articles.length}</span>
              </div>
              <div className='category-item-content'>{item.name}</div>
              <div className='category-item-operation'>
                <EditOutlined className='editIcon' onClick={() => showModal(item._id, item.name)} />
                <Popconfirm
                  title="确定删除此分类吗？"
                  onConfirm={() => deleteCategory(item._id, item.name)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className='deleteIcon' />
                </Popconfirm>
              </div>
            </List.Item>
          )}
        />

      </div>
    </div>
  )
}


export default connect(
  state => ({
    categories: state.categories,
    articles: state.articles
  }),
  {
    getArticles,
    getCategories
  }
)(Category)