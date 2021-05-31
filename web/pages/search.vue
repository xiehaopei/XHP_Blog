<template>
  <div>
    <div class="wrap">
      <div class="search">
        <input type="text" class="searchTerm" placeholder="What are you looking for?" />
        <button type="submit" class="searchButton">search</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    search() {
      this.$axios
        .post('article/search', {
          query: this.query
        })
        .then((result) => {
          console.log(result, 'res');
        });
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
  padding: 5px;
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
  margin-top: 20vh;
}
</style>