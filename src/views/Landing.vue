<template>
  <div id="landing" class="page-landing">
    <div class="landing-bg"></div>
    <div class="landing-content">
      <div class="l-content page-content">
        <div class="l-content-title">Madan</div>
        <div
          class="l-content-intro"
        >A Efficient Markdown Editor & A Converter For Markdown To Wechat Article</div>
        <div class="l-content-href" @click="handleEnterEditor">Markdown Now</div>
        <div class="l-content-author">By mykurisu & whung</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Layout } from "ant-design-vue";
// const { Header, Footer, Content } = Layout;

export default {
  name: "landing",
  // components: {
  //   Header,
  //   Footer,
  //   Content,
  //   Layout
  // }
  methods: {
    handleEnterEditor() {
      this.$router.push('/editor')
    }
  }
};
</script>

<style lang='less'>
.page-landing {
  .landing-bg {
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("https://blog-1252307419.cos.ap-beijing.myqcloud.com/markdown/md-now-banner-bg.jpg");
    // animation: bg 10s infinite;
  }

  @keyframes bg {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .landing-content {
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    line-height: 1;
    text-align: center;
    display: flex;
    align-items: center;

    .l-content {
      width: 100%;
    }

    .l-content-title {
      width: 100%;
      text-transform: uppercase;
      font-size: 30px;
      font-weight: 400;
      letter-spacing: 51px;
      color: #fff;
      opacity: 0.9;
      margin-bottom: 50px;
    }

    .l-content-intro {
      margin-bottom: 50px;
      position: relative;
      font-size: 19px;
      font-weight: 300;
      line-height: 1.2;
      opacity: 0.65;
    }

    .l-content-href {
      width: 240px;
      text-align: center;
      padding: 20px 0;
      font-size: 16px;
      border: 1px solid white;
      border-radius: 4px;
      margin: 0 auto 50px auto;
      cursor: pointer;
      opacity: 0.5;
      transition: background 1s;
      user-select: none;
      animation: href 10s infinite;
      &:hover {
        animation: none;
        background-color: white;
        color: rgba(0, 0, 0, 0.6);
        opacity: 1;
      }
    }

    @keyframes href {
      0% {
        background-color: rgba(255, 255, 255, 0);
        color: white;
        opacity: 0.5;
      }
      50% {
        background-color: rgba(255, 255, 255, 1);
        color: rgba(0, 0, 0, 0.6);
        opacity: 1;
      }
      100% {
        background-color: rgba(255, 255, 255, 0);
        color: white;
        opacity: 0.5;
      }
    }

    .l-content-author {
      font-size: 19px;
      font-weight: 300;
      line-height: 1.2;
      opacity: 0.45;
    }
  }
}
</style>