<template>
  <div class="article-list">
    <div class="article" v-for="item in articleList" :key="item.id">
      <div class="article-img">
        <img :src="item.image.url" />
      </div>
      <div class="article-detail">
        <div class="title" @click="viewArticle(item.id)">{{item.title}}</div>
        <div class="describe">{{item.describe}}</div>
        <div class="footer">
          <div class="time">
            <span>TIME {{item.time.slice(0,10)}}</span>
          </div>
          <div class="stuff">
            <div>
              <span>LIKE {{item.like}} / READ {{item.read}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['articleList'],
  methods: {
    viewArticle(id) {
      this.$router.push(`/${id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0.1rem auto;
  width: 80%;
  max-width: 800px;

  .article {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    margin-bottom: 30px;
    border: 1px solid #f1f1f1;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    transition: box-shadow 0.3s ease;

    &-img {
      img {
        border-style: none;
        width: 100%;
        height: 130px;
        object-fit: cover;
      }
    }

    &-detail {
      padding: 10px;
      text-align: left;

      .title {
        padding: 0 10px;
        font-weight: bold;
        font-size: 24px;
        cursor: pointer;

        &:hover {
          text-decoration: blue wavy underline;
        }
      }

      .describe {
        display: -webkit-box;
        overflow: hidden;
        padding: 10px 15px;
        max-height: 50px;
        line-height: 25px;
        font-size: 15px;
        text-overflow: ellipsis;
        word-wrap: break-word;

        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        &::selection {
          background-color: #ffff00;
        }
      }

      .footer {
        display: flex;
        justify-content: flex-end;
        height: 30px;
        line-height: 30px;

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
      box-shadow: 0 0 20px rgb(88, 87, 87);
    }
  }

  @media screen and (max-width: 900px) {
    .article-img {
      img {
        height: 100px;
      }
    }
  }

  @media screen and (max-width: 780px) {
    .article-img {
      img {
        height: 80px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .article-img {
      img {
        height: 50px;
      }
    }
  }
}
</style>