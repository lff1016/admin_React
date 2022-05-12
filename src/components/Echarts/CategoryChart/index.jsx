import React from 'react';
import { connect } from 'react-redux';
import ReactECharts from 'echarts-for-react';

import { getCategories } from '../../../redux/actions';
import './index.css'

const CategoryChart = ({ categories, getCategories }) => {
  const getdDataList = categories => {
    const dataList = []
    categories.map(item => {
      return dataList.push({name: item.name, value: item.c_articles.length})
    })
    return dataList
  }

  let option = {
    title: {
      text: '文章分类',
      left: '50%',
    },
    tooltip: {
      trigger: 'item'
    },
    legend: { // 图例
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '分类名称',
        type: 'pie',
        radius: '50%',
        width: '400px',
        height: '400px',
        left: '25%',
        // label: {
        //   show: false
        // },
        data: getdDataList(categories),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  return (
    <div className='card CategoryChart'>
      <div id='catrgory-pie'>
        <ReactECharts style={{width: '610px', height: '350px'}} option={option} />
      </div>
    </div>
  )
}

export default connect(
  state => ({
    categories: state.categories,
  }),
  {
    getCategories
  }
)(CategoryChart)
