<template>
  <div class="container index" :class="{navActive: isNav}">
    <div class="cover">
      <div id="scene" :style="{height:boxH}">
        <div class="layer" data-depth="0.4" :style="layerStyle">
          <img id="image" :style="imgStyle" :src="image" width="1920" height="1080" />
        </div>
      </div>
      <div class="head">
        <div class="menu" @click="menu">
          <span class="iconfont" :class="isNav ? 'icon-close' : 'icon-menu'"></span>
        </div>
      </div>
      <div class="misk" :style="{backgroundColor: info.cover.color}"></div>
      <div class="post">
        <div class="time">{{info.cover.date}}</div>
        <div class="title">{{info.cover.title}}</div>
        <div class="describe">{{info.cover.describe}}</div>
      </div>
      <!-- menu -->
      <div class="nav">
        <ul class="nav-list">
          <template v-for="(item, index) in navList">
            <template v-if="item.url == 'subscribe'">
              <li v-if="$store.state.data.email_subscribe" :key="index">
                <a @click="toPage(item.url)">{{item.title}}</a>
              </li>
            </template>
            <li v-else :key="index">
              <a @click="toPage(item.url)">{{item.title}}</a>
            </li>
          </template>
        </ul>
        <div class="world">
          <span>天行健，君子以自强不息！</span>
        </div>
      </div>
    </div>

    <div class="content" v-if="Object.keys(articleList.data).length > 0">
      <div class="post" v-for="(item, index) in articleList.data" :key="index">
        <div class="img-box" @click="article(item.id)">
          <img v-lazy="item.image.url" src="/image/lazy-load/default.jpg" :alt="item.image.name" />
        </div>
        <div class="info">
          <div class="time">{{item.time.month.cn}}月 {{item.time.day.on}}, {{item.time.year}}</div>
          <div class="title">
            <a @click="article(item.id)">{{item.title}}</a>
          </div>
          <div class="describe">{{item.describe}}</div>
          <div class="stuff">
            <div>
              <i class="iconfont icon-text"></i>
              <span>{{item.words}}</span>
            </div>
            <div>
              <i class="iconfont icon-eye"></i>
              <span>{{item.read}}</span>
            </div>
            <div>
              <i class="iconfont icon-like"></i>
              <span>{{item.like}}</span>
            </div>
          </div>
        </div>
      </div>
      <div @click="loadMoreData" class="more">
        <LoadMore :loadingType="loadingType"></LoadMore>
      </div>
    </div>

    <div class="foot" v-if="info.cover.icp_txt">
      <a :href="info.cover.icp_link" target="_blank">{{info.cover.icp_txt}}</a>
    </div>

    <BackTop v-if="isBack"></BackTop>

    <!-- loading -->
    <Loading v-if="loading"></Loading>
  </div>
</template>

<script>
import Parallax from 'parallax-js';
export default {
  name: 'index',
  data() {
    return {
      layerStyle: {},
      imgStyle: {},
      boxH: '100%',
      boxW: '100%',
      navList: [
				{
					title:'Search',
					url:'search'
				},
        {
          title: 'Article',
          url: 'article'
        },
        {
          title: 'About',
          url: 'about'
        }
      ],
      isNav: false,
      loading: true,
      loadingType: 'more',
      page: 1,

      isBack: true,

      image: null,
      windowChange: () => {}
    };
  },
  head() {
    return {
      title: this.info.web_name,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.info.web_seo },
        {
          hid: 'description',
          name: 'description',
          content: this.info.web_describe
        }
      ]
    };
  },
  computed: {
    info() {
      return this.$store.state.data;
    }
  },
  mounted() {
    document.body.style.overflowY = 'hidden';

    // Cover image loading is complete
    let img = new Image();
    img.src = this.info.cover.image;
    img.onload = () => {
      setTimeout(() => {
        this.image = this.info.cover.image;
        this.loading = false;
        document.body.style.overflowY = '';
      }, 1500);
    };

    // Homepage loaded
    this.$store.commit('isIndex');

    // Cover image init
    const scene = document.getElementById('scene');
    const parallaxInstance = new Parallax(scene, {
      relativeInput: true,
      clipRelativeInput: true
    });

    if (this.articleList.page == this.articleList.totalPage) {
      this.loadingType = 'nomore';
    }
  },
  async asyncData(context) {
    if (context.store.state.index) {
      // 防止重复加载
      return;
    }
    const { data } = await context.$axios.get('article');
    return { articleList: data.status == 1 ? data.body : {} };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init();
      vm.windowChange = vm.$debounce(vm.init, 100);
      window.onresize = () => vm.windowChange();
      vm.isBack = true;
    });
  },
  beforeRouteLeave(to, from, next) {
    document.body.style.overflowY = '';
    window.onresize = null;
    this.isBack = false;
    setTimeout(() => (this.isNav = false), 500);
    document.removeEventListener('touchmove', this.on, { passive: false });
    next();
  },
  methods: {
    // Cover image init
    init() {
      this.boxH = document.documentElement.clientHeight + 'px';
      this.boxW = document.documentElement.clientWidth + 'px';
      this.coverLayer();
    },
    // Cover image box calculation
    coverLayer() {
      let id = document.getElementById('scene'),
        _w = parseInt(this.boxW),
        _h = parseInt(this.boxH),
        x,
        y,
        i,
        e = _w >= 1000 || _h >= 1000 ? 1000 : 500;

      if (_w >= _h) {
        i = (_w / e) * 50;
        y = i;
        x = (i * _w) / _h;
      } else {
        i = (_h / e) * 50;
        x = i;
        y = (i * _h) / _w;
      }
      const style = {
        width: _w + x + 'px',
        height: _h + y + 'px',
        marginLeft: -0.5 * x + 'px',
        marginTop: -0.5 * y + 'px'
      };
      this.layerStyle = Object.assign({}, this.layerStyle, style);
      this.coverImg();
    },
    // Cover image size calculation
    coverImg() {
      const width = parseInt(this.layerStyle.width),
        height = parseInt(this.layerStyle.height),
        ratio = 1080 / 1920,
        style = {};

      const compute = height / width > ratio;

      style['width'] = compute ? height / ratio + 'px' : `${width}px`;
      style['height'] = compute ? `${height}px` : width * ratio + 'px';

      style['left'] = (width - parseInt(style.width)) / 2 + 'px';
      style['top'] = (height - parseInt(style.height)) / 2 + 'px';

      this.imgStyle = Object.assign({}, this.imgStyle, style);
    },
    loadMoreData() {
      if (this.loadingType == 'nomore' || this.loadingType == 'loading') return;

      this.page++;
      this.loadingType = 'loading';
      this.$axios
        .get(`article`, {
          params: {
            page: this.page
          }
        })
        .then((res) => {
          const result = res.data.body;
          if (res.data.status == 1) {
            setTimeout(() => {
              this.articleList.data = this.articleList.data.concat(result.data);

              this.$setScroll('.bottom-loading', 'index');

              this.loadingType =
                result.page == result.totalPage ? 'nomore' : 'more';
            }, 1000);
          } else {
            this.loadingType = 'more';
          }
        })
        .catch((err) => {
          this.loadingType = 'more';
        });
    },
    // Other pages
    toPage(url) {
      this.$router.push(`/${url}`);
    },
    // Nav
    menu() {
      this.isNav = !this.isNav;
      if (this.isNav) {
        document.addEventListener('touchmove', this.on, { passive: false });
      } else {
        document.removeEventListener('touchmove', this.on, { passive: false });
      }
      document.body.style.overflowY = this.isNav ? 'hidden' : '';
    },
    on(e) {
      e.preventDefault();
    },
    article(id) {
      this.$router.push(`/${id}`);
    }
  }
};
</script>
<style lang="scss" scoped>
.index {
  position: absolute;
  width: 100%;
  #scene {
    overflow: hidden;
    position: relative;
    height: 100%;
    #image {
      display: block;
      position: absolute;
      max-width: none;
    }
  }
  .cover {
    overflow: hidden;
    position: relative;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    .head {
      display: flex;
      position: absolute;
      top: 70px;
      z-index: 99999;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px 0 40px;
      width: 100%;
      color: #fff;
      .logo {
        transition: all 0.3s;
        .iconfont {
          cursor: pointer;
          font-size: 36px;
        }
      }
      .logo-img {
        position: relative;
        width: 100px;
        height: 44px;
        transition: all 0.3s;
        img {
          position: absolute;
          width: 100%;
          opacity: 1;
          cursor: pointer;
          transition: all 0.3s;
          &:last-child {
            opacity: 0;
          }
        }
      }
      .menu {
        border-radius: 2px;
        width: 30px;
        height: 30px;
        background: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        line-height: 32px;
        text-align: center;
        color: #ff3600;
        span {
          font-size: 20px;
        }
      }
    }
    .cover-bg {
      width: 100%;
      height: 100%;
      img {
        position: absolute;
      }
    }
    .misk {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(176, 14, 37, 0.7);
      clip-path: polygon(0 0, 25% 0, 60% 100%, 0% 100%);
    }
    .post {
      position: absolute;
      left: 10%;
      top: 54%;
      width: 30%;
      color: #fff;
      transform: translateY(-50%);
      .time {
        font-size: 14px;
      }
      .title {
        margin: 15px 0 30px;
        text-decoration: none;
        font-size: 36px;
        color: #fff;
        transition: all 0.3s;
        &:hover {
          text-decoration: underline;
        }
      }
      .describe {
        line-height: 24px;
        font-size: 20px;
      }
    }
  }
  .content {
    position: relative;
    margin: auto;
    padding-bottom: 80px;
    width: 1200px;
    text-align: center;
    &:after {
      position: absolute;
      left: 50%;
      top: -100px;
      z-index: 0;
      width: 1px;
      height: calc(100% + 100px);
      background: #eaeaea;
      content: '';
    }
    /deep/ .bottom-loading {
      position: relative;
      z-index: 999;
      .btn {
        display: inline-block;
        border: 1px solid #eaeaea;
        border-radius: 0;
        border-radius: 4px;
      }
    }

    .post {
      position: relative;
      z-index: 1;
      margin-top: 100px;
      .img-box {
        display: inline-block;
        overflow: hidden;
        position: relative;
        z-index: 3;
        border: 1px solid #f3fafd;
        border-radius: 6px;
        width: 680px;
        height: 440px;
        cursor: pointer;
        font-size: 0;
        transition: all 0.3s;
        img {
          width: 100%;
          height: 100%;
        }
        &:hover img {
          opacity: 0.95;
        }
      }
      .info {
        position: absolute;
        top: 20px;
        padding: 80px 100px 0 80px;
        border: 1px solid #eaeaea;
        border-radius: 6px;
        width: 500px;
        height: 400px;
        .time {
          font-size: 12px;
          color: #999;
        }
        .title {
          display: -webkit-box;
          overflow: hidden;
          margin-top: 8px;
          word-break: break-all;

          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          a {
            cursor: pointer;
            line-height: 30px;
            font-size: 24px;
            &:hover {
              background: radial-gradient(
                    circle at 10px -7px,
                    transparent 8px,
                    currentColor 8px,
                    currentColor 9px,
                    transparent 9px
                  )
                  repeat-x,
                radial-gradient(
                    circle at 10px 27px,
                    transparent 8px,
                    currentColor 8px,
                    currentColor 9px,
                    transparent 9px
                  )
                  repeat-x;
              background-position: -10px calc(100% + 16px), 0 calc(100% - 4px);
              background-size: 20px 20px;
              animation: waveFlow 1s infinite linear;
            }
            @keyframes waveFlow {
              from {
                background-position-x: -10px, 0;
              }
              to {
                background-position-x: -30px, -20px;
              }
            }
          }
        }
        .describe {
          display: -webkit-box;
          overflow: hidden;
          margin-top: 10px;
          line-height: 22px;
          font-size: 14px;
          color: #666;
          word-break: break-all;

          -webkit-line-clamp: 3; /* 指定行数*/
          -webkit-box-orient: vertical;
        }
        .stuff {
          display: flex;
          position: absolute;
          left: 80px;
          bottom: 80px;
          font-size: 12px;
          color: #999;
          div {
            display: flex;
            position: relative;
            align-items: center;
            padding: 6px;
            font-size: 12px;
            transition: all 0.3s;
            &:nth-of-type(1):hover {
              color: #ef6d57;
            }
            &:nth-of-type(2):hover {
              color: #50bcb6;
            }
            &:nth-of-type(3):hover {
              color: #ffa800;
            }
            .iconfont {
              display: inline-block;
              margin-right: 4px;
              margin-top: -4px;
              &.icon-like {
                margin-top: -1px;
                font-size: 14px;
              }
              &.icon-text {
                margin-top: -2px;
                font-size: 17px;
              }
            }
            span {
              display: inline-block;
            }
            &::before,
            &::after {
              visibility: hidden;
              position: absolute;
              left: 50%;
              bottom: 100%;
              opacity: 0;
              transition: all 0.3s;
            }
            &::before {
              padding: 5px 14px;
              border-radius: 10px;
              background: #ef6d57;
              font-size: 12px;
              color: #fff;
              white-space: nowrap;
              content: '善良';
              transform: translate(-50%, -5px);
            }
            &::after {
              border: 5px solid transparent;
              border-top-color: #ef6d57;
              content: '';
              transform: translate(-50%, 5px);
            }
            &:nth-of-type(2)::before {
              background: #50bcb6;
              content: '勇敢';
            }
            &:nth-of-type(3)::before {
              background: #ffa800;
              content: '坚持';
            }
            &:nth-of-type(2)::after {
              border-top-color: #50bcb6;
            }
            &:nth-of-type(3)::after {
              border-top-color: #ffa800;
            }
            &:hover::before,
            &:hover::after {
              visibility: visible;
              opacity: 1;
            }
          }
        }
      }
      &:nth-child(odd) {
        text-align: left;
        .info {
          left: 660px;
        }
      }
      &:nth-child(even) {
        text-align: right;
        .info {
          right: 660px;
          text-align: left;
        }
      }
    }
  }
  .foot {
    text-align: center;
    a {
      display: inline-block;
      margin: 0 auto;
      padding: 1px 0 2px;
      text-decoration: none;
      font-size: 13px;
      color: #666;
    }
  }
  .nav {
    display: flex;
    position: fixed;
    left: 0;
    top: -100%;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.96);
    transition: top 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
    .world {
      display: block;
      position: absolute;
      bottom: 30px;
      width: 100%;
      text-align: center;
      color: #999;
      span {
        font-size: 16px;
      }
    }
    .nav-list {
      display: block;
      margin-top: -120px;
      width: 80%;
      text-align: center;
      li {
        display: inline-block;
        list-style: none;
        margin: 0 20px 20px;
        a {
          cursor: pointer;
          font-size: 24px;
          color: #666;
          letter-spacing: 1px;
          &:hover {
            color: #222;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .content {
      width: 900px;
      .post {
        .img-box {
          width: 480px;
          height: 310px;
        }
        .info {
          top: 10px;
          padding: 50px 60px 0 60px;
          width: 420px;
          height: 290px;
          .stuff {
            left: 60px;
            bottom: 50px;
          }
          .title {
            margin-top: 10px;
            line-height: 25px;
          }
          .describe {
            -webkit-line-clamp: 2;
          }
        }
        &:nth-child(odd) .info {
          left: 450px;
        }
        &:nth-child(even) .info {
          right: 450px;
        }
      }
    }
  }
  @media screen and (max-width: 900px) {
    .cover {
      .misk {
        clip-path: polygon(0 0, 220px 0, 700px 100%, 0% 100%);
      }
      .post {
        width: 40%;
        .title a {
          font-size: 22px;
        }
      }
    }
    .content {
      width: 100%;
      .post {
        margin-top: 60px;
        border-bottom: 1px solid #eaeaea;
        background: #fff;
        .img-box {
          display: block;
          border: none;
          width: 100%;
          height: auto;
          text-align: center;
          img {
            width: 680px;
            max-width: 100%;
          }
        }
        .info {
          position: static;
          margin: auto;
          padding: 40px 20px 40px;
          border: none;
          width: 96%;
          height: auto;
          background: #fff;
          .stuff {
            position: static;
            margin: 20px 0 0 -6px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 780px) {
    .cover {
      .head {
        top: 40px;
      }
      .misk {
        background: rgba(176, 14, 37, 0.35);
        clip-path: none;
      }
      .post {
        left: 5%;
        top: auto;
        bottom: 8%;
        width: 70%;
        transform: none;
      }
      .cover-bg {
        img {
          position: absolute;
          left: 50%;
          top: 0;
          width: auto;
          height: 100%;
          transform: translateX(-50%);
        }
      }
    }
    .content {
      width: 100%;
      .post {
        .img-box {
          border-radius: 0;
          width: 100%;
          height: auto;
        }
      }
    }
    .nav {
      .nav-list {
        li {
          // margin: 0 12px;
          a {
            font-size: 18px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 480px) {
    .cover {
      .head {
        padding: 0 24px 0 20px;
        .logo-img {
          width: 80px;
          img {
            top: 6px;
          }
        }
      }
      .post {
        .time {
          display: none;
        }
        .title {
          margin-bottom: 10px;
        }
        .describe {
          line-height: 20px;
          font-size: 13px;
        }
      }
    }
    .nav .world span {
      font-size: 14px;
    }
  }
}
.container.navActive {
  .logo {
    color: #333;
  }
  .cover .head .logo-img img {
    opacity: 0;
    &:last-child {
      opacity: 1;
    }
  }
  .nav {
    top: 0;
  }
}
</style>