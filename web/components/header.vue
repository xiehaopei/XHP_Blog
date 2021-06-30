<template>
  <header :class="{qrccode, isUp}">
    <!-- Article Page -->
    <canvas v-if="like" id="qrccode"></canvas>

    <div class="l icon">
      <div class="logo-img" @click="toIndex">
        <img src="/image/logo/home.png" />
      </div>
      <span
        v-if="music"
        class="iconfont"
        :class="isStore ? 'icon-pause' : 'icon-play'"
        @click="changeMusic"
      ></span>
    </div>

    <div class="title" :class="{active: isTitle}">{{title}}</div>

    <div class="right-icon">
      <span class="iconfont icon-github" v-if="github" @click="locateGithub"></span>
      <!-- Article Page -->
      <template v-if="like">
        <span class="iconfont icon-wechat" @click="wechat"></span>
        <span class="iconfont icon-like" :class="{like: isLike}" @click="likeClick"></span>
      </template>

      <span class="myself" @click="myself">
        <img :src="$store.state.data.avatar" />
      </span>
    </div>

    <!-- Music Progress -->
    <div class="musicBar" :style="{width: changeProgress}"></div>

    <!-- mobile music icon -->
    <div class="music-btn" @click="changeMusic" :class="[mobileMusic]" v-if="music">
      <svg
        class="progress-circle"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
        <circle
          class="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <span class="iconfont" :class="isStore ? 'icon-pause' : 'icon-play'"></span>
    </div>

    <!-- music -->
    <audio id="music" loop="loop" preload="auto">
      <source type="audio/mpeg" :src="music" />
    </audio>
  </header>
</template>

<script>
import QRCode from 'qrcode';
export default {
  props: ['music', 'title', 'github', 'like'],
  data() {
    return {
      isStore: false,
      isTitle: false,
      timer: null,
      changeProgress: 0,

      percent: 0,
      mobileMusic: '',
      dashArray: Math.PI * 100,

      isLike: false,
      scrollTop: 0,
      qrccode: false,
      isUp: false,

      likeTime: null,
      likeHint: false,

      fnScroll: () => {}
    };
  },
  destroyed() {
    window.removeEventListener('scroll', this.fnScroll);
  },
  mounted() {
    if (this.like) {
      this.$nextTick(() => {
        const canvas = document.getElementById('qrccode');
        QRCode.toCanvas(canvas, window.location.href);
      });
    }
    // isLike
    const like = localStorage.getItem(`like-${this.like}`);
    this.isLike = Boolean(like);

    this.fnScroll = this.$throttle(this.handleScroll, 100);
    window.addEventListener('scroll', this.fnScroll);
  },
  computed: {
    // mobile music progress
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  methods: {
    // Scroll Change
    handleScroll() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const relust = scrollTop - this.scrollTop;
      this.scrollTop = scrollTop;

      this.isUp = scrollTop > 100 && relust < 0;

      if (scrollTop >= 100) {
        this.isTitle = true;
        this.mobileMusic = 'show';
      } else {
        this.isTitle = false;
        this.mobileMusic = this.mobileMusic ? 'exit' : '';
      }
    },
    wechat() {
      this.qrccode = !this.qrccode;
    },
    // like +1
    likeClick() {
      if (!this.isLike) {
        this.$axios.put(`article_like/${this.like}`).then((res) => {
          this.$emit('liked', true);
          this.isLike = true;
          localStorage.setItem(`like-${this.like}`, true);
        });
      }
    },
    changeMusic() {
      let music = document.getElementById('music');
      this.isStore = !this.isStore;
      if (this.isStore) {
        music.play();
        this.timer = setInterval(() => {
          const n = (100 * (music.currentTime / music.duration)).toFixed(2);
          const ns = 1 * (music.currentTime / music.duration);
          // Loop
          if (n >= 100) clearInterval(this.timer);
          this.changeProgress = n + '%';
          this.percent = ns;
        }, 50);
      } else {
        music.pause();
        clearInterval(this.timer);
      }
    },
    toIndex() {
      this.$router.push('/');
    },
    myself() {
      this.$router.push('/about');
    },
    locateGithub(){
      window.open(this.github,"_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #f6f7f8;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  padding: 0 15px;
  background: #fff;
  z-index: 99999;
  transition: all 0.3s;
  .musicBar {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 50px;
    z-index: -1;
    background: #eee;
  }
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.8s;
    text-align: center;
    opacity: 0;
    &.active {
      opacity: 1;
    }
  }
  .logo-img {
    width: 30px;
    margin-top: 4px;
    vertical-align: middle;
    display: inline-block;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .right-icon {
    .iconfont {
      color: #888;
      font-size: 20px;
      cursor: pointer;
      margin: 4px 5px 0;
      transition: all 0.3s;
      vertical-align: middle;
      display: inline-block;
      &.logo {
        color: #444;
        font-size: 30px;
      }
      &.icon-github {
        font-size: 28px;
        position: absolute;
        right: 48px;
        top: 5px;
        &:hover {
          color: #000;
        }
      }
      &.icon-like {
        font-size: 28px;
        position: absolute;
        right: 48px;
        top: 5px;
        &:hover {
          color: #ef6d57;
        }
      }
      &.like {
        color: #ef6d57;
      }
      &.icon-wechat {
        font-size: 28px;
        position: absolute;
        right: 85px;
        top: 5px;
        &:hover {
          color: #0cd438;
        }
      }
      &:hover {
        color: var(--colorDefault);
      }
    }
  }
  .myself {
    width: 28px;
    height: 28px;
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: bottom;
    margin-left: 2px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  #qrccode {
    height: 180px !important;
    width: 180px !important;
    padding: 10px;
    position: absolute;
    top: 60px;
    right: 10px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    box-shadow: 0 4px 10px #eee;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }
  &.qrccode {
    #qrccode {
      opacity: 1;
      visibility: visible;
    }
    .icon-wechat {
      color: #0cd438;
    }
  }
}
.music-btn {
  position: fixed;
  right: 15px;
  bottom: 60px;
  width: 36px;
  padding: 3px;
  height: 36px;
  color: #fff;
  opacity: 0.8;
  cursor: pointer;
  z-index: 1000;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: none;
  .progress-circle {
    height: 30px;
    width: 30px;
    circle {
      stroke-width: 10px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: #fff;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: #50bcb6;
      }
    }
  }
  .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    padding: 1px 0 0 3px;
    font-size: 14px;
    &.icon-pause {
      padding-left: 1px;
    }
  }
}
@media screen and (max-width: 600px) {
  header {
    position: absolute;
    .scrollbar {
      position: fixed;
      height: 1px;
    }
    .iconfont.logo {
      font-size: 28px;
      margin: 4px 0 0;
    }
  }
  .music-btn {
    opacity: 0;
    display: none;
    &.show {
      display: block;
      visibility: visible;
      animation: fadeInTop 0.6s both;
    }
    &.exit {
      display: block;
      opacity: 0;
      animation: fadeInDown 0.6s both;
    }
  }
}
@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}
@keyframes fadeInDown {
  from {
    opacity: 1;
    transform: translate(0, 0px);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 30px);
  }
}
</style>