import {
  HomeOutlined,
  BookOutlined,
  BarsOutlined,
  EditOutlined,
  InboxOutlined,
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  UserAddOutlined,
  ContactsOutlined
} from '@ant-design/icons'

const menuList = [
  {
    key: '/home',
    title: '首页',
    path: '/home',
    icon: <HomeOutlined/>
  },
  {
    key: 'sub1',
    title: '文章管理',
    icon: <BookOutlined/>,
    children: [
      {
        key: '/article',
        title: '文章列表',
        path: '/article',
        icon: <BarsOutlined/>
      },
      {
        key: '/article/edit',
        title: '文章编辑',
        path: '/article/edit',
        icon: <EditOutlined/>
      },
      {
        key: '/article/says',
        title: '说说',
        path: '/article/says',
        icon: <InboxOutlined/>
      }
    ]
  },
  {
    key: '/comment',
    title: '评论审核',
    path: '/comment',
    icon: <MessageOutlined/>
  },
  {
    key: 'sub2',
    title: '用户管理',
    icon: <TeamOutlined />,
    children: [
      {
        key: '/users',
        title: '用户列表',
        path: '/users',
        icon: <ContactsOutlined />,
      },
      {
        key: '/users/add',
        title: '添加用户',
        path: '/users/add',
        icon: <UserAddOutlined />,
      }
    ]
  },
  {
    key: '/profile',
    title: '个人信息',
    path: '/profile',
    icon: <UserOutlined />
  },
]

export default menuList