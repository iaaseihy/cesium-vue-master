<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import 'cesium/Build/Cesium/Widgets/bucket.css'
// import {
//   Viewer,
//   Cartesian3,
//   Color,
//   SkyBox,
//   ScreenSpaceEventHandler,
//   UrlTemplateImageryProvider,
//   WebMercatorTilingScheme,
//   CesiumTerrainProvider,
//   createOsmBuildings,
//   WebMapTileServiceImageryProvider
// } from 'cesium'
import { LOCAL_IMG_URL, LOCAL_TERRAIN_URL, GAODE_IMG_URL } from '../commonJS/config'
import { BaiduImageryProvider, AmapImageryProvider } from '../commonJS/BaiduImageryProvider'
import positiveX from '../../assets/img/SkyBox/00h+00.jpg'
import negativeX from '../../assets/img/SkyBox/12h+00.jpg'
import positiveY from '../../assets/img/SkyBox/06h+00.jpg'
import negativeY from '../../assets/img/SkyBox/18h+00.jpg'
import positiveZ from '../../assets/img/SkyBox/06h+90.jpg'
import negativeZ from '../../assets/img/SkyBox/06h-90.jpg'
var viewer, scene
export default {
  name: 'CesiumContainer',
  data() {
    return {
      subdomains: 1,
      coordiatesArr: []
    }
  },
  mounted() {
    /* eslint no-new: */
    this.initViewer()
    //new Viewer('cesiumContainer')
  },
  methods: {
    initViewer() {
      // Cesium.Ion.defaultAccessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MmE5ZjMxNi1hMTc3LTQzYzUtYWFjMi1jMTcxZWRmYjM4MzIiLCJpZCI6MjYzODMsImlhdCI6MTY2MzMyMTQ1OH0.iQ6jrVZHBcE411OFm16kB2xBTNLe6tAg625X_5bMNyM'
      // 天地图影像
      var imageryProvider1 = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=你的token',
        layer: 'tdtBasicLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible'
      })
      // 注记
      var imageryProvider2 = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=你的token',
        layer: 'tdtAnnoLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible'
      })
      // 本地影像
      var imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: LOCAL_IMG_URL,
        // url: GAODE_IMG_URL,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'png',
        minimumLevel: 0,
        maximumLevel: 19
      })
      var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: LOCAL_TERRAIN_URL,
        requestWaterMask: true //请求水波纹效果
      })
      // 百度
      var baiduImageryProvider = new BaiduImageryProvider({
        url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
        layer: 'tdtAnnoLayer',
        style: 'default',
        format: 'image/jpeg',
        maximumLevel: 18,
        subdomains: this.subdomains,
        tileMatrixSetID: 'GoogleMapsCompatible',
        crs: 'WGS84', // 坐标系: WGS84 、BD09 、GCJ02，仅百度、高德有效
        tilingScheme: null
      })
      viewer = new Cesium.Viewer('cesiumContainer', {
        terrainExaggeration: 0.95,
        imageryProvider: imageryProvider,
        // imageryProvider: baiduImageryProvider,
        // terrainProvider: terrainProvider,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        timeline: false,
        animation: false,
        selectionIndicator: false,
        infoBox: false
      })
      // 通过imageryLayers获取图层列表集合
      var layers = viewer.scene.imageryLayers
      // 图层列表集合的addImageryProvider方法:
      // 两个参数，第一参数是一个ImageryProvider函数，这个函数的作用是新建一个图层;第二个参数是index，Number类型，作用是指定新插入图层在图层列表集合中的索引(位置)，若不指定，默认新图层添加在最上层
      // 返回值是新添加到图层列表集合中的图层
      var baiduImageryLayer = layers.addImageryProvider(
        new BaiduImageryProvider({
          url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
          layer: 'tdtAnnoLayer',
          style: 'dark',
          format: 'image/jpeg',
          maximumLevel: 18,
          subdomains: this.subdomains,
          tileMatrixSetID: 'GoogleMapsCompatible',
          crs: 'WGS84', // 坐标系: WGS84 、BD09 、GCJ02，仅百度、高德有效
          tilingScheme: null
        })
      )
      // get或set图层透明度，范围是0-1
      baiduImageryLayer.alpha = 0.6

      // get或set图层亮度，小于1图层更暗，大于1更亮
      baiduImageryLayer.brightness = 1.0
      // 添加高德地图并使用插件纠偏
      var gaodeImageryLayer = layers.addImageryProvider(
        new AmapImageryProvider({
          url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          layer: 'tdtAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          maximumLevel: 18,
          subdomains: this.subdomains,
          tileMatrixSetID: 'GoogleMapsCompatible',
          crs: 'WGS84', // 坐标系: WGS84 、BD09 、GCJ02，仅百度、高德有效
          tilingScheme: null
        })
      )
      // get或set图层透明度，范围是0-1
      gaodeImageryLayer.alpha = 0.3

      // get或set图层亮度，小于1图层更暗，大于1更亮
      gaodeImageryLayer.brightness = 1.0
      // 修改影像图层颜色，变为暗色
      console.log(layers)
      this.modifyMap(viewer)
      // 百度
      // viewer.imageryLayers.addImageryProvider(
      //   new BaiduImageryProvider({
      //     url: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
      //     layer: 'tdtAnnoLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     maximumLevel: 18,
      //     subdomains: this.subdomains,
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     crs: 'WGS84', // 坐标系: WGS84 、BD09 、GCJ02，仅百度、高德有效
      //     tilingScheme: null
      //   })
      // )

      // 高德
      // viewer.imageryLayers.addImageryProvider(
      //   new AmapImageryProvider({
      //     url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      //     layer: 'tdtAnnoLayer',
      //     style: 'default',
      //     format: 'image/jpeg',
      //     maximumLevel: 18,
      //     subdomains: this.subdomains,
      //     tileMatrixSetID: 'GoogleMapsCompatible',
      //     crs: 'WGS84', // 坐标系: WGS84 、BD09 、GCJ02，仅百度、高德有效
      //     tilingScheme: null
      //   })
      // )

      //用于渲染星空的SkyBox对象
      viewer.scene.skyBox = new Cesium.SkyBox({
        sources: {
          positiveX: positiveX,
          negativeX: negativeX,
          positiveY: positiveY,
          negativeY: negativeY,
          positiveZ: positiveZ,
          negativeZ: negativeZ
        }
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      viewer.scene.globe.showGroundAtmosphere = false
      // viewer.scene.globe.baseColor = Color.BLACK
      viewer.scene.globe.baseColor = new Cesium.Color(1, 1, 1, 0) //修改地球颜色
      // viewer.scene.primitives.add(createOsmBuildings())
      // viewer.scene.camera.flyTo({
      //   destination: Cartesian3.fromDegrees(-74.019, 40.6912, 750)
      // })

      viewer.camera.setView({
        // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: Cesium.Cartesian3.fromDegrees(99, 36.4, 18000008),
        orientation: {
          // 指向
          //heading:Cesium.Math.toRadians(90,0),
          // 视角
          //pitch:Cesium.Math.toRadians(-90),
          //roll:0.0
        }
      })
      viewer.scene.globe.depthTestAgainstTerrain = true
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      this.$store.state.cesiumDrawHandler = handler
      window.cesiumViewer = viewer
      scene = viewer.scene
      // // 加载100000个模型
      // this.addGlbCollection()
      viewer.camera.moveEnd.addEventListener(this.getCurrentExtent)
    },
    /* Cesium修改地图颜色代码(暗色电子地图) */
    modifyMap(viewer) {
      // 获取地图影像图层
      const baseLayer = viewer.imageryLayers.get(0)
      // 设置两个变量，用来判断是否进行颜色的翻转和过滤
      const options = {
        invertColor: true,
        filterRGB: [0, 50, 100]
      }
      // 更改地图着色器代码
      const baseFragShader = viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources
      for (let i = 0; i < baseFragShader.length; i++) {
        // console.log(baseFragShader[i])
        // console.log('------')

        const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
        let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
        if (options.invertColor) {
          strT += `
      color.r = 1.0 - color.r;
      color.g = 1.0 - color.g;
      color.b = 1.0 - color.b;
      `
        }
        if (options.filterRGB.length > 0) {
          strT += `
      color.r = color.r * ${options.filterRGB[0]}.0/255.0;
      color.g = color.g * ${options.filterRGB[1]}.0/255.0;
      color.b = color.b * ${options.filterRGB[2]}.0/255.0;
      `
        }
        baseFragShader[i] = baseFragShader[i].replace(strS, strT)
      }
    },
    // 获取当前相机视角内的图幅范围
    getCurrentExtent() {
      // 范围对象
      var extent = {}

      // 得到当前三维场景
      var scene = viewer.scene

      // 得到当前三维场景的椭球体
      var ellipsoid = scene.globe.ellipsoid
      var canvas = scene.canvas

      // canvas左上角
      var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid)

      // canvas右下角
      var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid)

      // 当canvas左上角和右下角全部在椭球体上
      if (car3_lt && car3_rb) {
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude)
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude)
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude)
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude)
      }

      // 当canvas左上角不在但右下角在椭球体上
      else if (!car3_lt && car3_rb) {
        var car3_lt2 = null
        var yIndex = 0
        do {
          // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
          yIndex <= canvas.height ? (yIndex += 10) : canvas.height
          car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid)
        } while (!car3_lt2)
        var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2)
        var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb)
        extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude)
        extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude)
        extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude)
        extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude)
      }

      // 获取高度
      extent.height = Math.ceil(viewer.camera.positionCartographic.height)
      // 获取当前缩放的地图层级
      let level = 0
      if (viewer.scene.globe._surface._tilesToRender.length) {
        level = viewer.scene.globe._surface._tilesToRender[0].level
        console.log('当前地图层级=======', level)
      }
      console.log('地图变化监听事件', extent, (extent.xmin + extent.xmax) / 2, (extent.ymax + extent.ymin) / 2)
    },
    /* 批量处理gltf或glb格式模型 */
    getModelPostInstances(data) {
      var modelPosts = []

      for (var y = 0; y < data.length; ++y) {
        var longitude = data[y].longitude
        var latitude = data[y].latitude
        var height = data[y].height

        var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

        var heading = Math.random()
        var pitch = Math.random()
        var roll = Math.random()
        // var scale = ((Math.random() + 1.0) / 4.0) * 100
        var scale = 10000
        var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, new Cesium.HeadingPitchRoll(heading, pitch, roll))

        Cesium.Matrix4.multiplyByUniformScale(modelMatrix, scale, modelMatrix)

        modelPosts.push({
          modelMatrix: modelMatrix
        })
      }

      return modelPosts
    },
    /* 加载gltf或glb格式模型 */
    addGlbCollection() {
      for (let i = 0; i < 100000; i++) {
        var longitude = 108.841552734374 + Math.random() * (150 - 124.25) // [124.25,150)
        var latitude = 27.8779283336792 + Math.random() * (60 - 28)
        var height = 100 + Math.random() * (5000 - 100)
        var ccord = { longitude, latitude, height }
        this.coordiatesArr.push(ccord)
      }
      console.log(this.coordiatesArr)
      var modelInstances = this.getModelPostInstances(this.coordiatesArr)
      console.log(modelInstances)
      var instanceCollection = scene.primitives.add(
        new Cesium.ModelInstanceCollection({
          url: '/static/gltf/Cesium_Man.glb',

          instances: modelInstances
        })
      )
    }
  }
}
</script>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
