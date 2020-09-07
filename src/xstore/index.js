import Vue from 'vue';
import Vuex from './xvuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    ADD(state, payload) {
      state.count += payload;
    },
    DOUBLE(state) {
      state.count *= 2;
    }
  },
  actions: {
    ADD({ commit }, payload) {
      setTimeout(() => {
        commit('ADD', payload);
      }, 1000);
    }
  },
  modules: {}
});
