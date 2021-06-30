<template>
  <div>
    <Header title="天行健，君子以自强不息！" v-if="refresh"></Header>

    <div class="container">
      <div class="wrap">
        <div class="search">
          <input
            type="text"
            v-model="query"
            class="searchTerm"
            @keyup.enter="search"
            placeholder="What are you looking for?"
          />
          <button type="submit" class="searchButton" @click="search">search</button>
        </div>
      </div>

      <ArticleList :articleList="ArticleList"/>
    </div>

    <!-- loading -->
    <Loading v-if="loading"></Loading>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      ArticleList:[],
      loading: false,
      refresh: true
    };
  },
  methods: {
    async search() {
      this.loading = true;
      const { data: res } = await this.$axios.post('article/search', {
        query: this.query
      });
      this.ArticleList = res.body;
      this.loading = false;
      console.log(this.ArticleList)
      if(this.ArticleList.length === 0){
        console.log('无结果')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 96%;
  display: flex;
  justify-content: center;
}

.searchTerm {
  width: 500px;
  border: 3px solid #00b4cc;
  border-right: none;
  padding: 10px;
  height: 45px;
  border-radius: 5px 0 0 5px;
  outline: none;
  color: #9dbfaf;
}

.searchTerm:focus {
  color: #00b4cc;
}

.searchButton {
  width: 100px;
  min-width: 90px;
  height: 45px;
  border: 1px solid #00b4cc;
  background: #00b4cc;
  text-align: center;
  color: #fff;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 20px;
}

.wrap {
  display: flex;
  justify-content: center;
  padding-top: 20vh;
  padding-bottom: 20vh;
}
</style>