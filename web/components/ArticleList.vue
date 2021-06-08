<template>
  <div class="article-list">
    <div class="article" v-for="item in articleList" :key="item.id">
      <div class="article-img">
        <img :src="item.image" />
      </div>
      <div class="article-detail">
        <div class="title">{{item.title}}</div>
        <div class="describe">{{item.describe}}</div>
        <div class="footer">
          <div class="time">
            <span>{{item.time}}</span>
          </div>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ['articleList']
};
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0.1rem auto;
  width: 98%;
  max-width: 800px;

  .article {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    margin-bottom: 0.3rem;
    border: 1px solid #f1f1f1;
    border-radius: 0.1rem;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    transition: box-shadow 0.3s ease;

    &-img {
      img {
        border-style: none;
        width: 100%;
        height: 1.5rem;
        object-fit: cover;
      }
    }

    &-detail {
      padding: 0.1rem;
      text-align: left;

      .title {
        padding: 0 0.1rem;
        font-weight: bold;
        font-size: 0.4rem;
      }

      .discribe {
        display: -webkit-box;
        overflow: hidden;
        padding: 0 0.1rem;
        max-height: 0.5rem;
        line-height: 0.25rem;
        font-size: 0.15rem;
        text-overflow: ellipsis;
        word-wrap: break-word;

        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .footer {
        display: flex;
        justify-content: flex-end;
        height: 0.3rem;
        line-height: 0.3rem;

        .icon {
          margin-right: 5px;
          width: 20px;
          height: 20px;
          vertical-align: middle;

          stroke-width: 1.33;
        }

        span {
          margin-right: 25px;
          vertical-align: middle;
          font-size: 15px;
        }
      }
    }

    &:hover {
      box-shadow: 0 0 20px #ddd;
    }
  }
}
</style>