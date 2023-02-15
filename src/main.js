import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'lib-flexible/flexible'
import axios from'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// 引入vant组件
import {
  Button,
  Tab,
  Tabs,
  Search,
  Icon
} from 'vant';


// 注册组件
Vue.use(Button)
   .use(Tab)
   .use(Tabs)
   .use(Search)
   .use(Icon)
   
// 获取编辑推荐表单
axios.defaults.baseURL = "https://apis.netstart.cn/music"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
