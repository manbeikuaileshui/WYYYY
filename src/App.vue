<template>
  <div id="app">
    <!-- 展示一级路由 -->
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
  // 推荐音乐和热歌榜公用样式
  .newset_box {
    padding: 0 5px;

    .newset_item {
      display: flex;
      height: 56px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;

      .newset_left {
        width: 90%;

        > div {
          // 单行文本溢出显示省略号
          // 文字长度超出限制宽度，则隐藏超出的内容
          white-space: nowrap;
          // 溢出隐藏
          overflow: hidden;
          // 多行文本的情况下，用省略号隐藏溢出范围的文本
          text-overflow: ellipsis;
        }
        .song_name {
          font-size: 16px;
          color: #333;
        }
        .song_auth {
          margin-top: 5px;
          .song_right {
            font-size: 12px;
            color: #888;
          }

          .song_left {
            width: 15px;
            height: 10px;
            display: inline-block;
            background: url("./assets/index_icon_2x.png") no-repeat 0 2px;
            background-size: 166px 97px;
          }
        }
      }
      .newset_right {
        .icon {
          width: 22px;
          height: 22px;
          margin-right: 5px;
          background: url("./assets/index_icon_2x.png") no-repeat -24px 0;
          background-size: 166px 97px;
        }
        img {
          width: 22px;
          height: 22px;
          display: block;
        }
      }
    }
  }
}
</style>
