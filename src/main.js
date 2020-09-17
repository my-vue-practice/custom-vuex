import Vue from 'vue';
import App from './App.vue';
import store from './xstore';

Vue.config.productionTip = false;

new Vue({
  store,
  data: { name: 'app' },
  render: h => h(App)
}).$mount('#app');
