import { createApp, Vue } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
process.env.VUE_APP_MOCK === 'true' && require('./mock/mock.js')
// main.js中引入ElementUI
// Vue.use(ElementUI)
// Vue.config.productionTip = false
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
