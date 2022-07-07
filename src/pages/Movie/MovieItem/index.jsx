import React from 'react';
import {
  Image,
  Typography,
  Popover,
} from 'antd';
import { HeartTwoTone, SettingTwoTone } from '@ant-design/icons';

import errImg from '../../../assets/img/img_err.jpg';

export default function MoviemovieItemInfo({ movieItemInfo, editMovie}) {

  /* antd 设置 */
  const { Paragraph, Text } = Typography;
  const [ellipsis, setEllipsis] = React.useState(true);

  // 设置按钮的 html 内容
  const content = (
    <div style={{ width: '30px' }}>
      <a onClick={() => editMovie(movieItemInfo.movieNo)}>编辑</a>
      <a>删除</a>
    </div>
  )


  return (
    <div className='card-movieItemInfo' key={movieItemInfo.movieNo}>
      <div className='movie-cover movie-movieItemInfo-left'>
        <Image
          className='movie-img'
          src='https://www.nfyingshi.com/wp-content/uploads/2022/04/6bc591fb4d926251b401637e7ddff66c-270x380.jpg'
          alt=""
          fallback={errImg}
        />
      </div>
      <div className='movie-movieItemInfo-right'>
        <div className='movie-info'>
          <div className='info movie-name'>
            <Text
              style={ellipsis ? { width: 150 } : undefined}
              ellipsis={ellipsis ? { tooltip: movieItemInfo.movieName } : false}
            >
              {movieItemInfo.movieName}
            </Text>
            <span className='movie-score'>{movieItemInfo.movieScore}</span>
          </div>
          <div className='info movie-category'>
            类型：{movieItemInfo.movieCategoryName}
            {/* {
                movieItemInfo.movieCategory.map((tag, index) => {
                  return <Tag key={index} color={tagsColor[index]}>{tag}</Tag>
                })
              } */}
          </div>
          <div className='infomovie-area'>
            地区：{movieItemInfo.countryAreaName}
          </div>
          <div className='info movie-year'>
            <span className='movie-publishDate'>年份：{movieItemInfo.showYear}</span>
            {/* <span className='movie-watchDate'>观看：{movieItemInfo.movieWatchYear}</span> */}
          </div>
          <div className='info movie-comment'>
            <Paragraph ellipsis={ellipsis ? { rows: 2, tooltip: movieItemInfo.personalComment } : false}>
              简介：{movieItemInfo.personalComment}
            </Paragraph>
          </div>

        </div>
        <div className='movie-action'>
          <a href={movieItemInfo.movieLink} className='movie-play' target='_blank'>立即观看</a>
          <div className='movie-action-setting'>
            <HeartTwoTone className='movie-like' style={{ fontSize: '20px' }} />
            <Popover content={content} trigger="click" overlayStyle={{ width: '80px' }} placement='topRight' arrowPointAtCenter>
              <SettingTwoTone className='setting' style={{ fontSize: '20px' }} />
            </Popover>
          </div>

        </div>
      </div>
    </div>
  )
}
