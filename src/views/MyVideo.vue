<template>
  <div>
    <a-card>
      <el-upload
        ref="upload"
        class="avatar-uploader"
        :action="htp"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :headers="headers"
      >
        <a-button size="small" type="primary">点击上传</a-button>
      </el-upload>
      <el-table :data="tableData" style="width: 100%;margin-top:40px">
        <el-table-column prop="mvName" label="视频名称"> </el-table-column>
        <el-table-column prop="mvSize" label="大小(B)"> </el-table-column>
        <el-table-column prop="mvHour" label="时长"></el-table-column>
        <el-table-column prop="uploadTime" label="上传日期"> </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <a @click="getvideoUrl(scope.row.mvAddress)">
              <i style="font-size: 30px;cursor: pointer;" class="el-icon-video-play"></i>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="total"
        style="float:right"
      ></el-pagination>
    </a-card>
    <a-card>
      <div class="test_two_box">
        <video id="myVideo" controls preload="auto" class="video-js" style="display: none; width:100%;">
          <source :src="videoUrl" type="application/x-mpegURL" />
        </video>
      </div>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage.js'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'
import video_zhCN from 'video.js/dist/lang/zh-CN.json'
import video_en from 'video.js/dist/lang/en.json'
videojs.addLanguage('zh-CN', video_zhCN)
videojs.addLanguage('en', video_en)
export default {
  data () {
    return {
      headers: {},
      query: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0,
      htp: window._CONFIG['domianURL'] + '/m3u8/m3u8/transCoding',
      videoUrl: '',
      player: ''
    }
  },
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.getlist()
  },
  mounted(){
  },
  methods: {
    beforeUploadVideo (file) {
      var fileSize = file.size / 1024 / 1024 < 10
      if (
        ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(
          file.type
        ) == -1
      ) {
        this.$message.warning('请上传正确的视频格式')
        return false
      }
      if (!fileSize) {
        this.$message.warning('视频大小不能超过10MB')
        return false
      }
    },
    getlist () {
      getAction('/m3u8/m3u8/mvList', this.query).then(res => {
        this.tableData = res.result.records
        this.total = res.result.total
      })
    },
    handleVideoSuccess (response, file, fileList) {
      if (response.code == 200) {
        this.$message.success(response.result)
        this.getlist()
      } else {
        this.$message.error(response.result)
      }
      this.$refs.upload.clearFiles()
    },
    handleSizeChange (pageSize) {
      this.query.pageSize = pageSize
      this.getlist()
    },
    handleCurrentChange (currentPage) {
      this.query.pageNo = currentPage
      this.getlist()
    },
    getvideoUrl (url) {
      this.videoUrl = url
      this.$nextTick(() => {
        this.player = videojs(
          'myVideo',
          {
            bigPlayButton: false,
            textTrackDisplay: false,
            posterImage: true,
            errorDisplay: false,
            controlBar: {
              children: [
                'playToggle', // 播放按钮
                'volumePanel', // 音量控制
                'currentTimeDisplay', // 当前已播放时间
                'progressControl', // 播放进度条
                'durationDisplay', // 总时间
                'audioTrackButton'
              ],
              PictureInPictureToggle: true,
              FullscreenToggle: true // 全屏
            },
            language: 'zh-CN'
          },
          function () {
            this.play() // 自动播放
          }
        )
        this.player.src({
          src: url
        })
      })
      document.getElementById('myVideo').style.display = 'block'
    }
  },
  destroyed () {
    this.player.dispose()
  }
}
</script>
<style lang="less" scoped>
/deep/.video-js .vjs-time-control {
  display: block;
}
/deep/.video-js .vjs-remaining-time {
  display: none;
}
</style>
