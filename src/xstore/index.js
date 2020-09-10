import Vue from 'vue';
import Vuex from './xvuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    todos: [
      {
        id: 1,
        text: '买iPhone 12',
        done: false
      },
      {
        id: 2,
        text: '买小米小黑板',
        done: true
      },
      {
        id: 3,
        text: '买iPad Pro',
        done: false
      },
      {
        id: 3,
        text: '实现vuex',
        done: true
      }
    ]
  },
  getters: {
    doubleCount: state => state.count * 2,
    doubleDoubleCount: (state, getters) => getters.doubleCount * 2,
    getTodoById: state => id => {
      console.log(state, id);
      return state.todos.filter(todo => todo.id === id)[0];
    }
  },
  mutations: {
    ADD(state, payload) {
      state.count += payload;
    },
    MINUS(state, payload) {
      state.count -= payload.amount;
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
