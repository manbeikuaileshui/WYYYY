<template>
  <div class="hot">
    <div class="bg_box">
      <div>
        <div class="log_box"></div>
        <div class="time">更新日期：{{time}}</div>
      </div>
    </div>

    <!-- 音乐列表 -->
    <div class="newset_box">
      <div class="newset_item" v-for="item in hot" :key="item.id">
        <!-- 歌曲序号 -->
        <div class="num" :style="`color:${item.color}`">{{item.num}}</div>
        <!-- 左侧歌曲名和歌手 -->
        <div class="newset_left">
          <div class="song_name">{{ item.name }}</div>
          <div class="song_auth">
            <i class="song_left"></i>
            <span class="song_right"
              >{{ item.ar[0].name }} --
              {{ item.name }}</span
            >
          </div>
        </div>
        <!-- 右侧播放按钮 -->
        <div class="newset_right" @click="clickPlay(item)">
          <div v-show="item.isPlay" class="icon"></div>
          <img v-show="!item.isPlay" src="../assets/autoplay.gif">
        </div>
      </div>
    </div>
    <audio ref="audio"></audio>
    <div class="footer">查看完整榜单</div>
  </div>
</template>

<script>
export default {
  name: "Hot",
  // 页面初始数据
  data() {
    return {
      // 当天时间
      time: '',
      // 热歌榜数据
      hot: [],
      // 当前正在播放歌曲id
      songid: '',
    };
  },
  // 页面逻辑（方法）
  methods: {
    // 获取当天时间
    getDate() {
      // 创建时间日期对象 new Date()
      // getFullYear: 获取年份
      // getMonth: 获取月份（0-11）
      // getDate：获取天数（日）
      var currentTime = new Date()
      // console.log(currentTime);
      // console.log(currentTime.getMonth() + 1);
      // console.log((currentTime.getDate()));
      // 拼接日期
      this.time = `${currentTime.getMonth() + 1}月${currentTime.getDate()}日`
      // console.log(this.time);
    },
    // 获取热歌榜数据
    getHotSong() {
      this.axios({
        method: 'GET',
        url: '/playlist/detail',
        params: {id: 3778678}
      }).then((result)=> {
        // console.log(result);
        // console.log(result.data);
        // console.log(result.data.playlist.tracks);
        // 遍历数据
        result.data.playlist.tracks.slice(0,20).map((item, index) => {
          // console.log(item.name,index);
          // 添加序号
          item.num = index + 1 < 10 ? '0' + (index + 1) : index + 1
          // console.log(item.num);
          // 给前三个添加颜色
          if(index < 3) {
            item.color = '#df3436'
          }
          // 添加isPlay属性
          item.isPlay = true
          return item;
        })
        this.hot = result.data.playlist.tracks.slice(0,20);
        // console.log(this.hot);
      })
    },
    // 播放歌曲
    clickPlay(e) {
      // 将所有的播放状态统一设置为暂停
      this.hot.map((item) => {
        item.isPlay = true;
      })
      // 获取页面上的audio标签
      var audio = this.$refs.audio
      if(this.songid == e.id) {
        // 控制音乐的状态
        if(audio.paused) {
          // 如果音乐是暂停的就继续播放
          audio.play()
          e.isPlay = !e.isPlay
        } else {
          // 调用暂停的方法
          audio.pause()
        }
      } else {
        e.isPlay = !e.isPlay
        // 将播放id赋值回去
        this.songid = e.id
        // 将音乐地址复制回去给audio
        audio.src = `https://music.163.com/song/media/outer/url?id=${e.id}.mp3`
        // 播放方法
        audio.play()
      }
    }
  },
  // 生命周期
  created() {
    this.getDate(),
    this.getHotSong()
  },
};
</script>

<style lang="less" scoped>
.hot {
  .bg_box {
    width: 100%;
    height: 146px;
    background: url("../assets/hot_music_bg_2x.jpg") no-repeat center center /
      cover;
    > div {
      padding: 20px 0 0 20px;
      .log_box {
        width: 142px;
        height: 67px;
        background: url("../assets/index_icon_2x.png") no-repeat -24px -30px;
        background-size: 166px 97px;
      }
      .time {
        margin-top: 10px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
  .newset_box {
    .newset_item {
      > .num {
        width: 40px;
        height: 100%;
        text-align: center;
        line-height: 56px;
        color: #999;
        font-size: 16px;
      }
    }
  }
  .footer {
    width: 375px;
    height: 55px;
    text-align: center;
    line-height: 55px;
    font-size: 14px;
    color: #999;
  }
}
</style>