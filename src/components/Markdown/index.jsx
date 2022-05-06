// import React, { Component } from 'react';
// import MarkdownIt from 'markdown-it';
// import MdEditor from 'react-markdown-editor-lite';
// import hljs from 'highlight.js'
// // 导入编辑器的样式，不导入会出现毫无样式情况
// import 'react-markdown-editor-lite/lib/index.css';
// import 'highlight.js/styles/atom-one-light.css'

// export default class Markdown extends Component {

//   mdEditor = null
//   mdParser = null

//   constructor(props) {
//     super(props)
//     // 配置 md 编译
//     this.mdParser = new MarkdownIt({
//       html: true,
//       linkify: true,
//       typographer: true,
//       highlight: function (code) {
//         return hljs.highlightAuto(code).value;
//       }
//     })
//   }

//   // 将 html 渲染为 md


//   render() {
//     return (
//       <div>index</div>
//     )
//   }
// }


import React, {useState, useEffect} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import hljs from 'highlight.js'
// 导入编辑器的样式，不导入会出现毫无样式情况
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/atom-one-light.css'


export default function Markdown(props) {
  // 数据保存
  const [value, setValue] = useState("")
  // 组件挂载时填充markdown
  useEffect(() => {
    setValue(props.detail)
  }, [])

  // markdown-it 利用设置参数，具体查询markdown-it官网
  const mdParser = new MarkdownIt({
    html: true, /* 在源代码中启用 HTML 标签 */
    linkify: false, /* 将类似 URL 的文本自动转换为链接 */
    typographer: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
  }).enable('image');
  // 检测markdown数据变化
  function handleEditorChange({ html, text }) {
    setValue(text)
    props.getContent(text)
  }


  return (
    <MdEditor
      value={value}
      onChange={handleEditorChange}
      renderHTML={text => mdParser.render(text)}
      style={{ height: 400 }}
    >
    </MdEditor>
  )
}
