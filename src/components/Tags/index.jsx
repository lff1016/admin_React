import React, { useState, useEffect } from 'react';
import { Modal, Input, Popconfirm, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import './index.css';
import { getTags } from '../../redux/actions';
import { connect } from 'react-redux';
import { reqTagsList, reqAddTag, reqDeleteTag, reqUpdateTag } from '../../api/index'

const Tags = props => {

  // 定义标签的背景色
  const tagColor = ['#f50', '#2db7f5', '#87d068', '#108ee9', '#3b5999']

  // ————获取 Tags 数据，并放入 redux 中————
  const getAllTags = async () => {
    const res = await reqTagsList()
    props.getTags(res.data)
  }
 
  useEffect(() => {
    getAllTags()
  }, [])
  // ————添加标签 start ————
  const [tagInput, setTagInput] = useState('')
  const addTag = async () => {
    console.log(tagInput);
    reqAddTag(tagInput)
      .then(res => {
        if(res.status === 0) {
          setTagInput('')
          message.success('添加标签成功！😀')
          getAllTags()
        }
      })
  }
  // ————添加标签 end ————

  // ————修改标签 start ————
  // ————展示修改 Modal 框 start————
  const [tagEditVisible, setTagEditVisible] = useState(false)
  const [oldTagId, setOldTagId] = useState('')
  const [tagEditInput, setTagEditInput] = useState('')
  const showModal = (tagId, oldTagName) => {
    setTagEditVisible(true)
    setTagEditInput(oldTagName)
    setOldTagId(tagId)
  }
  // ————展示修改 Modal 框 end ————
  const editTag = async () => {
    console.log('修改标签');
    reqUpdateTag(oldTagId, tagEditInput)
      .then(res => {
        if(res.status === 0) {
          setOldTagId('')
          setTagEditInput('')
          setTagEditVisible(false)
          message.success('修改标签成功！😀')
          getAllTags()
        }
      })
  }

  // 取消修改
  const editTagCancle = () => {
    setTagEditVisible(false)
  }
  // ————修改标签 end ————

  // ————删除标签 start ————
  const deleteTag = async (tagId) => {
    console.log('删除标签', tagId);
    reqDeleteTag(tagId)
      .then(res => {
        if(res.status === 0) {
          message.success('删除标签成功！😀')
          getAllTags()
        }
      })
  }
  // ————删除标签 end ————

  return (
    <div className='card tags'>
      <div className='tags-title'>标签</div>
      <div className='tags-add'>
        <Input
          type='text'
          placeholder='请输入新的标签~'
          onKeyUp={e => { if (e.keyCode === 13) addTag() }}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
        />
        <Button type='primary' onClick={addTag}>添加</Button>
      </div>
      <div className='tags-list'>
        <Modal
          title='修改标签'
          centered
          visible={tagEditVisible}
          onOk={editTag}
          onCancel={editTagCancle}
          width={400}
          okText='确认'
          cancelText='取消'
        >
          <Input
            type='text'
            className='editTagInput'
            value={tagEditInput}
            onChange={e => setTagEditInput(e.target.value)}
            onKeyUp={e => { if (e.keyCode === 13) editTag() }}
          />
        </Modal>
          {
            props.tags.map((tag, index) => {
              return (
                <span
                className='tag-item'
                style={{backgroundColor: tagColor[index % tagColor.length]}}
                onDoubleClick={() => showModal(tag._id, tag.name)}
                key={tag._id}
              >
                <i className='tagName'>{tag.name}</i>
                <Popconfirm
                  title="确定要删除吗？🧐"
                  onConfirm={() => deleteTag(tag._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseOutlined className='closeIcon' />
                </Popconfirm>
              </span>
              )
            })
          }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    tags: state.tags
  }),
  {
    getTags
  }
)(Tags)
