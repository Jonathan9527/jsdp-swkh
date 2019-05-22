// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui'
import Boss from './boss.config.js'
import PublicFun from './publicFun.js'
import echarts from 'echarts'
import tools from './assets/js/utils'

import "./directives.js"

import $ from 'jquery'

import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/rest.css'
import '@/assets/css/common.css'
import '@/assets/font/iconfont.css'


import "@/assets/font/font2/iconfont.css" //iconfont图标
import "@/assets/font/iconfont/iconfont.css" //iconfont图标


Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(Boss);
Vue.use(PublicFun);
Vue.prototype.$http = axios;
Vue.prototype.$tools = tools
Vue.prototype.$echarts = echarts;
axios.defaults.withCredentials = true;
axios.defaults.headers = globalConfig.header;

//重定向router 
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // this.$store.state.app.visitedViews = []
    sessionStorage.removeItem('personal');

  }
  let data = sessionStorage.getItem("personal");
  if (!data && to.path !== '/login') {
    next({path: '/login'});
  } else if (data && to.path === '/') {
    next({path: '/shouye'});
  } else {
    next();
  }
});



//监听所有请求设置统一拦截
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
},  (error)=> {
  // 对响应错误做点什么
  if(error.response.data.response_desc == "尚未登录，请登录!"){
    router.push({
      path: "/login"
    })
    ElementUI.Message.error(error.response.data.response_desc)
  }
  if(error.response.status == "401"){
    ElementUI.Message.error(error.response.data.response_desc)
  }
 
});

//第一个参数设计图尺寸，第二个参数要设置的根元素font-size大小
getRem(1920, 100);
window.onresize = function() {
    getRem(1920, 100)
};

function getRem(pwidth, prem) {
    
    var html = document.getElementsByTagName("html")[0];
     //获取视窗宽度
     //下面的代码是为了考虑兼容性
     //在IE7、IE8、Firefox中，document.body.clientWidth以及 document.body.clientHeightzhi值为0，此时，可以使用 document.documentElement.clientHeight等代替。
    var oWidth = document.documentElement.clientWidth || document.body.clientWidth;
   
    if(oWidth<1366){
      oWidth = 1366
    }
    html.style.fontSize = oWidth / pwidth * prem + "px";
}



new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
