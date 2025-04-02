<template>
  <div style="background-color: white;">
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="12" style="margin-top:20px;" :offset="1">
            <el-button @click="addPoint" v-if="addPointFlag == false">加点</el-button>
            <el-button v-else @click="()=>{addPointFlag = false}">取消</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1"></el-col>
          <el-col :span="20" :offset="1" style="margin-top:20px;margin-bottom:50px">
            <div id="map"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="warehouseVisible"
      width="30%"
      :close-on-click-modal="false"
      v-dialog-drag
    >
      <el-form>
        <el-form-item label="机构选择">
          <el-select
            v-model="form.id"
            placeholder="请选择"
            :popper-append-to-body="false"
            :disabled="!isEdit"
          >
            <el-option
              v-for="item in warehouseGroup"
              :key="item.id"
              :label="item.departName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" v-if="isEdit">确 定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    loadDictOptions
  } from '@/utils/util'
import { getAction, postAction } from '@/api/manage';


  export default {
    data() {
      return {
        map: null,
        iconStorage: null,
        type: null, //左边列表选择类型（边防点添加等）
        form: {}, //表单
        latlng: null, //坐标数据
        dialogTitle: null, //对话框标题
        warehouseVisible: false, //库房信息
        warehouseGroup: null,
        addPointFlag: false, //加点标识
        mapTypeValue: 'tiles', //默认地图
        markGroup: null, //标志组
        mapDatas: [], //点数据
        mapHref: window._CONFIG['domianURL'] + '/static/file',
        isEdit: false, //看点击的是图片还是地图，地图则是编辑，图片则是查看
      }
    },
    mounted() {
      //地图限制
      let northwest = L.latLng(120, 350)
      let southeast = L.latLng(-80, -206)
      this.map = L.map('map', {
        maxZoom: 3,
        maxNativeZoom: 3,
        minZoom: 1,
        doubleClickZoom: false,
        maxBounds: L.latLngBounds(northwest, southeast),
      })

      // 初始化标点图标信息
      this.iconStorage = new L.Icon({
        iconUrl: this.mapHref + '/marker-icon.png',
      shadowUrl: this.mapHref + '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
      })

      this.map.on('click', ({
        latlng
      }) => {
        this.latlng = latlng
        this.onlick()
      })

      //初始化标志组
      this.markGroup = L.layerGroup([]).addTo(this.map)

      var opt = {
        tileSize: L.point(355, 206)
      }
      L.tileLayer(this.mapHref + '/' + this.mapTypeValue + '/{z}/{x}/{y}.png', opt).addTo(this.map)
      this.map.setView([35, 70], 1)
            this.getWareHouseMarkers()
    },
    methods: {
      async init() {
        await getAction('/sys/sysDepart/orgLists').then(res=>{
          if(res.success){
            this.warehouseGroup = res.result
          }else{
            this.$message.error(res.message)
          }
        })
      },
      addPoint() {
        // this.clearMarkers()
        this.addPointFlag = true
      },
      onlick() {
        if (this.addPointFlag) {
          this.form = {}
          this.isEdit = true
            this.dialogTitle = "添加机构"
            this.warehouseVisible = true
        }
      },
      getWareHouseMarkers() {
        getAction('/sys/sysDepart/orgLists').then(res => {
          if (res.code == 200) {
            this.mapDatas = res.result
            this.addWareHouseMarkers()
          }
        })
      },
      addWareHouseMarkers() {
        for (let i = 0; i < this.mapDatas.length; i++) {
          let marker = L.marker([this.mapDatas[i].latitude, this.mapDatas[i].longitude], {
            icon: this.iconStorage,
          })
          let that = this
          this.markGroup.addLayer(marker)
          marker.on('click', () => {
            this.isEdit = false
            this.dialogTitle = "机构详情"
            that.form.id = this.mapDatas[i].id
            that.warehouseVisible = true
          })
        }
      },
      //清除所有标志
      clearMarkers() {
        this.markGroup.clearLayers()
      },
      submit() {
          this.form.latitude = this.latlng.lat
          this.form.longitude = this.latlng.lng
          this.form.mapType = this.mapTypeValue
          postAction('/sys/sysDepart/updateOrgInfo',this.form).then(res => {
            this.$message.success('编辑成功')
            this.clearMarkers()
            this.getWareHouseMarkers()
          })
          this.warehouseVisible = false
      },
      cancel() {
        this.warehouseVisible = false
      },
    },
    created() {
      this.init()
      let _this = this
      window.showMap = _this.showMap
    },
    destroyed() {
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
#map {
  width: 100%;
  height: 60vh;
  background-color: white;
}
/deep/ #map {
  background: transparent;

  .leaflet-control-container {
    .leaflet-right {
      a {
        display: none !important;
      }
    }
  }
}

.Menu {
  position: relative;
  z-index: 999;
  margin-top: 5px;
  margin-left: 5px;
}

/deep/ .leaflet-control-zoom,
.leaflet-bar,
.leaflet-control {
  display: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 120px;
}

/deep/ li.el-menu-item {
  height: 45px;
}

/deep/ .el-select-dropdown {
  position: absolute !important;
  top: 30px !important;
}
</style>
