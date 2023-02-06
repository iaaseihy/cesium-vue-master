<!--
 * @Descripttion: 等高线页面
 * @version: v1.0
 * @Author: caochaoqiang
 * @Date: 2023-02-03 11:43:18
 * @LastEditors: caochaoqiang
 * @LastEditTime: 2023-02-06 13:47:12
-->
<template>
      <el-row>
            <el-col>
                  <div class="demo-container">
      <label><input type="radio" name="shadingMaterials"
        value="none" data-bind="checked: selectedShading">无渲染</label> <label><input
        type="radio" name="shadingMaterials" value="elevation"
        data-bind="checked: selectedShading">高程渲染</label>
    </div>
    <div class="demo-container">
      <div>
        <label><input type="checkbox"
          data-bind="checked: enableContour">等高线</label>
      </div>
      <div>
        高程 <input style="width: 136px; float: left; width: 100px;"
          type="range" min="1.0" max="500.0" step="1.0"
          data-bind="value: contourSpacing, valueUpdate: 'input', enable: enableContour" @change="test2()">
        <span data-bind="text: contourSpacing"></span>m
      </div>
      <div class="demo-container">
            <div>
               <el-checkbox v-model="viewModel.enableContour" @change="isContour"> 等高线 </el-checkbox>
            </div>
            <div class="elevation">
            <el-slider
                v-model="viewModel.contourSpacing"
                @change="setMapPercentage"
                :max="500.0"
                :min="1.0"
                show-input/>
                <span>{{viewModel.contourSpacing}}m</span>
                <!-- <el-slider
                v-model="viewModel.contourSpacing"
                :show-tooltip="false"></el-slider> -->
      </div>
      <div class="lineWidth">
            <el-slider
                v-model="viewModel.contourWidth"
                @change="setContourWidth"
                :max="10.0"
                :min="1.0"
                :step="1.0"
                show-input/>
                <span>{{viewModel.contourWidth}}m</span>
                <!-- <el-slider
                v-model="viewModel.contourSpacing"
                :show-tooltip="false"></el-slider> -->
      </div>
      <div class="contourColor">
            <el-button @click="changeColor">颜色</el-button>
      </div>
      </div>
      <div>
        线宽 <input style="width: 125px; float: left; width: 100px;"
          type="range" min="1.0" max="10.0" step="1.0"
          data-bind="value: contourWidth, valueUpdate: 'input', enable: enableContour" @click="test2">
        <span data-bind="text: contourWidth"></span>px
      </div>
      <div>
        <button type="button"
          data-bind="click: changeColor, enable: enableContour">颜色</button>
      </div>
    </div>
            </el-col>
      </el-row>
</template>

<script>
import * as Cesium from 'cesium'
export default {
  name: 'ContourLine',
  props: ['test', 'viewer'],
  data() {
    return {
      minHeight: -414.0, // approximate dead sea elevation
      maxHeight: 8777.0, // approximate everest elevation
      contourColor: Cesium.Color.RED.clone(),
      contourUniforms: {},
      shadingUniforms: {},
      viewModel: {
        enableContour: true,
        contourSpacing: 50.0,
        contourWidth: 2.0,
        selectedShading: 'none'
      //   changeColor: function () {
      //     contourUniforms.color = Cesium.Color.fromRandom(
      //       { alpha: 1.0 },
      //       contourColor
      //     )
      //   }
      },
      elevationValue: [50.0, 500.0],
      elevationRamp: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
      slopeRamp: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
      aspectRamp: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
      // 判断是否被拖动
      isChange: false
    }
  },
  mounted() {
  },
  methods: {
    getElevationContourMaterial() {
      // Creates a composite material with both elevation shading and contour lines
      return new Cesium.Material({
        fabric: {
          type: 'ElevationColorContour',
          materials: {
            contourMaterial: {
              type: 'ElevationContour'
            },
            elevationRampMaterial: {
              type: 'ElevationRamp'
            }
          },
          components: {
            diffuse:
          'contourMaterial.alpha == 0.0 ? elevationRampMaterial.diffuse : contourMaterial.diffuse',
            alpha:
          'max(contourMaterial.alpha, elevationRampMaterial.alpha)'
          }
        },
        translucent: false
      })
    },
    getColorRamp(selectedShading) {
      var ramp = document.createElement('canvas')
      ramp.width = 100
      ramp.height = 1
      var ctx = ramp.getContext('2d')

      var values
      if (selectedShading === 'elevation') {
        values = this.elevationRamp
      } else if (selectedShading === 'slope') {
        values = this.slopeRamp
      } else if (selectedShading === 'aspect') {
        values = this.aspectRamp
      }

      var grd = ctx.createLinearGradient(0, 0, 100, 0)
      grd.addColorStop(values[0], '#000000') // black
      grd.addColorStop(values[1], '#2747E0') // blue
      grd.addColorStop(values[2], '#D33B7D') // pink
      grd.addColorStop(values[3], '#D33038') // red
      grd.addColorStop(values[4], '#FF9742') // orange
      grd.addColorStop(values[5], '#ffd700') // yellow
      grd.addColorStop(values[6], '#ffffff') // white

      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 100, 1)

      return ramp
    },
    changeColor: function () {
      this.contourUniforms.color = Cesium.Color.fromRandom(
        { alpha: 1.0 },
        this.contourColor
      )
    },
    updateMaterial(viewer) {
      var hasContour = this.viewModel.enableContour
      var selectedShading = this.viewModel.selectedShading
      var globe = viewer.scene.globe
      var material
      if (hasContour) {
        if (selectedShading === 'elevation') {
          material = this.getElevationContourMaterial()
          this.shadingUniforms = material.materials.elevationRampMaterial.uniforms
          this.shadingUniforms.minimumHeight = this.minHeight
          this.shadingUniforms.maximumHeight = this.maxHeight
          this.contourUniforms = material.materials.contourMaterial.uniforms
        } else {
          material = Cesium.Material.fromType('ElevationContour')
          this.contourUniforms = material.uniforms
        }
        this.contourUniforms.width = this.viewModel.contourWidth
        this.contourUniforms.spacing = this.viewModel.contourSpacing
        this.contourUniforms.color = this.contourColor
      } else if (selectedShading === 'elevation') {
        material = Cesium.Material.fromType('ElevationRamp')
        this.shadingUniforms = material.uniforms
        this.shadingUniforms.minimumHeight = this.minHeight
        this.shadingUniforms.maximumHeight = this.maxHeight
      }
      if (selectedShading !== 'none') {
        this.shadingUniforms.image = this.getColorRamp(selectedShading)
      }
      globe.material = material
    },
    test2(val) {
      console.log(this.viewModel.contourSpacing)
      console.log(val)
    },
    // 鼠标拖拽松开时
    setMapPercentage(val) {
      console.log(val)
      console.log(this.viewModel.contourSpacing)
      this.contourUniforms.spacing = parseFloat(this.viewModel.contourSpacing)
      // this.isChange = false
    },
    setContourWidth() {
      console.log(this.viewModel.contourWidth)
      this.contourUniforms.width = parseFloat(this.viewModel.contourWidth)
    },
    isContour() {
      console.log(this.viewModel.enableContour)
      this.viewModel.enableContour = !this.viewModel.enableContour
    }
  }
}
</script>

<style scoped>
.demo-container{
      margin-left:400px
}
.elevation{
      width: auto;
}
</style>
