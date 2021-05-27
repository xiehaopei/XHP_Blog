<template>
  <div>
    搜索页
  </div>
</template>

<script>
export default {
  data() {
    return {
      query:''
    }
  },
  methods: {
    search(){
      this.$axios.post('article/search', {
        query: this.query
      }).then((result)=>{
				console.log(result, 'res');
			});
    }
  },
}
</script>
