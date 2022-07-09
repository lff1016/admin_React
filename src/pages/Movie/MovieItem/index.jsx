import React, { useState } from 'react';
import {
  Image,
  Typography,
  Button
} from 'antd';
import { useBoolean } from 'ahooks';
import { CaretRightOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { getMovies } from '../../../redux/actions';
import errImg from '../../../assets/img/img_err.jpg';
import { connect } from 'react-redux';

import './index.css';

export default function MoviemovieItemInfo({ movieItemInfo, getMovieNoAndAction}) {

  /* antd 设置 */
  const { Paragraph, Text } = Typography;
  const [ellipsis, setEllipsis] = React.useState(true);

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
          <Button type="primary" ghost href={movieItemInfo.movieLink} size="small"  shape="round" icon={<CaretRightOutlined style={{fontSize: '18px'}} />} />
          {/* <a href={movieItemInfo.movieLink} className='movie-play' target='_blank'>立即观看</a> */}
          <div className='movie-action-setting'>
            {/* 编辑 */}
            <Button 
              type="primary" 
              shape="round" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => getMovieNoAndAction(movieItemInfo.movieNo, 'edit')}
              >
              </Button>
            {/* 删除 */}
            <Button 
              type="primary" 
              danger 
              shape="round" 
              size="small" 
              icon={<DeleteOutlined />}
              onClick={() => getMovieNoAndAction(movieItemInfo.movieNo, 'delete')}
              >
              
              </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
