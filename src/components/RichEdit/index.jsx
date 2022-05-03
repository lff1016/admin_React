// 富文本编辑器
import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichEdit extends Component {

  static propTypes = {
    detail: PropTypes.string
  }

  state = { editorState: EditorState.createEmpty() }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
      }
    }

  }

  // static getDerivedStateFromProps(nextProps, preState) {

    // 将 html 转化为文本的方法
  //   const htmlTextState = (html) => {
  //     console.log(html);
  //     if (html) {
  //       const contentBlock = htmlToDraft(html)
  //       const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  //       const editorState = EditorState.createWithContent(contentState)
  //       return editorState
  //     }
  //   }
  //   if (nextProps) {
  //     const html = nextProps.detail
  //     // 将新传入的 props 生成的文本 和 之前 state 中的进行对比
  //     if (htmlTextState(html) !== preState.editorState) {
  //       return { editorState: htmlTextState(html) }
  //     }
  //   }
  //   return null
  // }

  // 输入过程中实时得回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getDetail = () => {
    // 返回输入数据对应的 html 格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  // 富文本中的图片上传
  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/admin/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        const url = response.data.url
        resolve({ data: { link: url } })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        editorStyle={{ backgroundColor: '#fff', padding: '5px 20px', height: '250px' }}
        onEditorStateChange={this.onEditorStateChange}
        hashtag={{}}
        toolbar={{
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
            uploadCallback: this.uploadImageCallBack,
            previewImage: true,
            inputAccept: 'image/*',
            alt: { present: false, mandatory: false, previewImage: true }
          },
        }}
      />
    )
  }
}
