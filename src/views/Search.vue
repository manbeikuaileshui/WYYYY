<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search_box">
      <van-search
        shape="round"
        background="#fbfcfd"
        placeholder="搜索歌曲、歌手、专辑"
        v-model="value"
        @search="Search"
        @input="proposal"
      />
    </div>

    <div v-if="searchContent.length == 0">
      <div v-show="isShow">
        <!-- 热门搜索 -->
        <div class="hotWord">
          <span class="title">热门搜索</span>
          <div class="list">
            <div
              class="item"
              v-for="(item, index) in hotData"
              :key="index"
              @click="clickSearch(item.first)"
            >
              {{ item.first }}
            </div>
          </div>
        </div>
        <!-- 搜索历史 -->
        <div class="history_box" v-if="!historyList.length == 0">
          <div class="h_title">
            <span>搜索历史</span>
            <span @click="clearall">一键清空</span>
          </div>
          <!-- 历史记录 -->
          <div class="history_list">
            <div
              class="history_item"
              v-for="(item, index) in historyList"
              :key="index"
            >
              <!-- img -->
              <div class="img_box">
                <img src="../assets/history.jpg" alt="" />
              </div>
              <div class="history_song_name" @click="clickSearch(item.kw)">{{ item.kw }}</div>
              <div class="history_del" @click="clear(index)">
                <img src="../assets/del.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 搜索建议 -->
      <div v-if="!searchkw.length == 0" class="suggestions_box">
        <!-- 标题 -->
        <div class="suggestions_title">搜索“{{ value }}”</div>
        <!-- 建议词 -->
        <div
          class="suggestions_item"
          v-for="(item, index) in searchkw"
          :key="index"
          @click="clickSearch(item.keyword)"
        >
          <van-icon name="search" size="18" />&nbsp;
          {{ item.keyword }}
        </div>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search_content" v-if="!searchContent.length == 0">
      <!-- 最佳匹配 -->
      <div class="search_title">最佳匹配</div>
      <!-- 歌手信息 -->
      <div class="songs_info">
        <div class="songs_img">
          <img src="../assets/xzq.jpg" alt="" />
        </div>
        <div class="songs_dec">
          歌手：
          <span>{{searchContent[0].ar[0].name}}</span>
          <span v-if="searchContent[0].ar[0].alias[0]">（{{searchContent[0].ar[0].alias[0]}}）</span>
        </div>
        <div class="right">
          <img src="../assets/right.jpg" alt="" />
        </div>
      </div>
      <!-- 歌曲 -->
      <div class="newset_box"  v-for="(item, index) in searchContent" :key="index">
        <div class="newset_item">
          <!-- 左侧歌曲名和歌手 -->
          <div class="newset_left">
            <div class="song_name">{{item.name}}</div>
            <div class="song_auth">
              <i class="song_left"></i>
              <span class="song_right">{{ item.ar[0].name }} -- {{ item.name }}</span>
            </div>
          </div>
          <!-- 右侧播放按钮 -->
          <div class="newset_right" @click="clickPlay(item)">
            <div v-show="item.isPlay" class="icon"></div>
            <img v-show="!item.isPlay" src="../assets/autoplay.gif" />
          </div>
        </div>
      </div>
      <audio ref="audio"></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  // 页面初始数据
  data() {
    return {
      // 热门搜索数据
      hotData: [],
      // 搜索框数据
      value: "",
      // 搜索历史记录
      historyList: [],
      // 是否显示热门搜索和搜索记录
      isShow: true,
      // 搜索建议
      searchkw: [],
      // 搜索结果
      searchContent: [],
      // 当前正在播放歌曲id
      songid: ''
    };
  },
  // 页面逻辑（方法）
  methods: {
    // 获取热门搜索数据
    getHotData() {
      // 向服务器发送请求
      this.axios({
        method: "GET",
        url: "/search/hot",
      }).then((result) => {
        // console.log(result);
        this.hotData = result.data.result.hots;
        // console.log(this.hotData);
      });
    },
    // 搜索
    Search() {
      // 获取输入框的内容
      var obj = {
        kw: this.value,
      };
      // 调用搜索结果
      this.kwsearch(this.value);
      // 读取本地历史记录 localStorage.getItem(key)
      var keyword = JSON.parse(localStorage.getItem("kw"));
      // 判断localStorage是否有历史数据
      if (keyword) {
        if (this.value.trim()) {
          // 如果有记录则在原来的记录上新增一条
          keyword.unshift(obj);
          // 赋值到页面
          this.historyList = keyword;
          // console.log(this.historyList);
          localStorage.setItem("kw", JSON.stringify(keyword));
        }
      } else {
        // 如果没有本地存储的情况下，直接设置本地存储
        // localStorage.setItem(key,value)
        // JSON.stringify(obj)
        if (this.value.trim()) {
          localStorage.setItem("kw", JSON.stringify([obj]));
          // console.log(JSON.stringify([obj]));
          // 赋值到页面
          this.historyList = [obj];
        }
      }
    },
    // 搜索建议
    proposal() {
      // console.log(this.value);
      // 判断输入框的值是否为空，不为空，显示搜索建议，为空，显示热门搜索和搜索历史
      if (this.value.length != 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
        // 置空搜索内容
        this.searchContent = [];
      }
      // 向服务器发送请求
      this.axios({
        method: "GET",
        url: "/search/suggest",
        // 请求参数
        params: {
          // type: 如果传 'mobile' 则返回移动端的数据（可选参数）
          type: "mobile",
          // keywords：关键词（必选参数）
          keywords: this.value,
        },
      })
        .then((result) => {
          // 赋值给搜索建议
          this.searchkw = result.data.result.allMatch;
        })
        .catch((err) => {
          this.searchkw = [];
        });
      // console.log(this.searchkw);
    },
    // 搜索结果
    kwsearch(value) {
      // 发送请求
      this.axios({
        method: "GET",
        url: "/cloudsearch",
        params: {
          keywords: value,
        },
      }).then((result) => {
        // 给所有歌曲添加isPlay属性
        result.data.result.songs.map((item)=> {
          item.isPlay = true;
          return item;
        })
        // 赋值到页面
        this.searchContent = result.data.result.songs;
        // console.log(this.searchContent);
      });
    },
    // 播放歌曲
    clickPlay(e) {
      // 将所有的播放状态统一设置为暂停
      this.searchContent.map((item) => {
        item.isPlay = true;
      });
      // 获取页面上的audio标签
      var audio = this.$refs.audio;
      if (this.songid == e.id) {
        // 控制音乐的状态
        if (audio.paused) {
          // 如果音乐是暂停的就继续播放
          audio.play();
          e.isPlay = !e.isPlay;
        } else {
          // 调用暂停的方法
          audio.pause();
        }
      } else {
        e.isPlay = !e.isPlay;
        // 将播放id赋值回去
        this.songid = e.id;
        // 将音乐地址复制回去给audio
        audio.src = `https://music.163.com/song/media/outer/url?id=${e.id}.mp3`;
        // 播放方法
        audio.play();
      }
    },
    // 点击热搜词进行搜索
    clickSearch(value) {
      // console.log(value);
      this.value = value;
      // 调用搜索结果方法
      this.kwsearch(this.value)
      this.Search()
    },
    // 清除全部搜索记录
    clearall() {
      // 将页面的historyList数据置空
      this.historyList = [];
      // 清空所有本地存储
      // localStorage.clear();
      // 清除单条本地存储
      localStorage.removeItem('kw')
    },
    // 清除单条历史记录
    clear(index) {
      // console.log(index);
      // 删除所点击的历史记录。物理删除(只是删除html元素)
      this.historyList.splice(index, 1)
      // console.log(this.historyList);
      // 更新本地存储（删除本地存储数据实现真实删除数据）
      localStorage.setItem("kw", JSON.stringify(this.historyList));
    },
  },
  // 生命周期
  created() {
    this.getHotData();
    // 读取本地历史记录
    var keyword = JSON.parse(localStorage.getItem("kw"));
    if (keyword) {
      this.historyList = keyword;
    }
  },
};
</script>

<style lang="less" scoped>
.search {
  .search_box {
    border-top: 1px solid #e8e8e8;
  }
  .hotWord {
    padding: 15px 10px 0;
    .title {
      font-size: 12px;
      color: #666;
    }
    .list {
      margin: 10px 0;
      .item {
        height: 32px;
        line-height: 30px;
        display: inline-block;
        padding: 0px 14px;
        border-radius: 32px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin: 0 8px 8px 0;
        font-size: 14px;
      }
    }
  }
  .history_box {
    .h_title {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
      padding: 0 8px;
    }
    .history_list {
      .history_item {
        div {
          height: 45px;
        }
        display: flex;
        align-items: center;
        img {
          width: 100%;
        }
        .img_box {
          width: 15px;
          height: 15px;
          margin: 0 10px;
          border-bottom: 0;
        }
        .history_song_name {
          flex: 9;
          color: #333;
          font-size: 14px;
          border-bottom: 1px solid #eeeff0;
          line-height: 45px;
        }
        .history_del {
          width: 35px;
          height: 35px;
          padding: 5px 0;
          border-bottom: 1px solid #eeeff0;
          img {
            width: 30px;
            height: 30px;
            margin-top: 4px;
          }
        }
      }
    }
  }
  .suggestions_box {
    div {
      height: 50px;
      line-height: 50px;
      font-size: 15px;
    }
    .suggestions_title {
      color: #507daf;
      margin-left: 15px;
      border-bottom: 1px solid #eeeff0;
    }
    .suggestions_item {
      margin-left: 15px;
      border-bottom: 1px solid #eeeff0;
    }
  }
  .search_content {
    .search_title {
      font-size: 14px;
      color: #6a666a;
      margin: 5px 0;
      padding-left: 5px;
    }
    .songs_info {
      display: flex;
      align-items: center;
      height: 55px;
      border-bottom: 1px solid #eeeff0;
      .songs_img {
        width: 50px;
        height: 50px;
        padding-left: 8px;
        img {
          width: 100%;
          display: block;
        }
      }
      .songs_dec {
        width: calc(~"100% -103px");
        padding: 0 15px 0 8px;
        font-size: 16px;
        > span:nth-child(1) {
          color: #506dc0;
        }
      }
      .right {
        width: 45px;
        text-align: center;
        margin: 7px 0 0 40px;
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>