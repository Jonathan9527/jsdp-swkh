<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {mapGetters} from 'vuex';
  import {mapActions} from "vuex";

  export default {
    name: 'App',
    created() {
      let that = this;
      this.$http.interceptors.response.use((response) => {
        // 对响应数据做点什么
        if (response.data.code === '10044') {
          that.$alert(response.data.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/login');
            }
          });
        }
        return response;
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });
    },
    computed: {
      ...mapState({
        content: state => state.app.show
      })
    },
  }
</script>

<style lang="scss">
html{height: 100%;} 
body{height: 100%;}
#app{height: 100%;}
</style>
