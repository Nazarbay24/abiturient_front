import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import './axios.config.js'
import router from './router'
import store from './store'
import i18n from './i18n'
import SignEcp from './components/SignEcp';
import VueYandexMetrika from 'vue-yandex-metrika'      

Vue.config.productionTip = true
Vue.prototype.$http = axios;

i18n.locale = store.getters.getLanguage;

Vue.use(VueYandexMetrika, {
    id: '82007521',
    router: router,
    options: {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    },
    env: 'production'
    // env: 'development'
});

Vue.component('SignEcp', SignEcp);
new Vue({
    vuetify,
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
