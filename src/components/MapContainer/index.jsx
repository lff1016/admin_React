import React, { Component } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import './index.css'

export default class MapContainer extends Component {
  constructor() {
    super();
    this.map = {};
  }
  // 2.dom渲染成功后进行map对象的创建
  componentDidMount() {
    AMapLoader.load({
      key: "c629ac8a9edae7a5ae44d2837fed4ece", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.CitySearch'],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
      this.map = new AMap.Map("container", { //设置地图容器id
        viewMode: "",         //是否为3D地图模式
        zoom: 5,                //初始化地图级别
        center: [105.602725, 37.076636], //初始化地图中心点位置
      });
    }).catch(e => {
      console.log(e);
    })
  }
  render() {
    // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
    return (
      <div id="container" className="map" style={{ height: '800px' }} >
      </div>
    );
  }
}
