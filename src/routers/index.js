import { Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Articel from '../pages/Articel/index';
import Edit from '../pages/Articel/Edit';
import Draft from '../pages/Articel/Draft';
import Comment from '../pages/Comment';
import User from '../pages/User/index';
import Add from '../pages/User/Add';
import Profile from '../pages/Profile';

export default [
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/articel',
    element: <Articel/>,
    children: [
      {
        path: 'edit',
        element: <Edit/>,
      },
      {
        path: 'draft',
        element: <Draft/>,
      }
    ]
  },
  {
    path: '/comment',
    element: <Comment/>,
  },
  {
    path: '/user',
    element: <User/>,
    children: [
      {
        path: '/user/add',
        element: <Add/>,
      }
    ]
  },
  {
    path: '/profile',
    element: <Profile/>,
  },
  {
    path: '/',
    element: <Navigate to='/home'/>
  }
]