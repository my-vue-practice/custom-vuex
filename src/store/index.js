import Vue from 'vue';
import Vuex from '../x-vuex';
// import Vuex from 'vuex';

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
    add(state, payload) {
      console.log('[root]', payload);
      state.count += payload;
    },
    minus(state, payload) {
      state.count -= payload.amount;
    },
    double(state) {
      state.count *= 2;
    }
  },
  actions: {
    addAsync({ commit }, payload) {
      setTimeout(() => {
        commit('add', payload);
      }, 1000);
    }
  },
  // TODO: modules实现
  modules: {
    /**
     * state:
     * {
     *  count: 0,
     *  todos: [],
     *  moduleA: { count: 0 }
     * }
     */
    moduleA: {
      namespaced: true,
      state: { count: 0 },
      mutations: {
        add(state, payload, rootState) {
          console.log('[moduleA]', payload, rootState);
          state.count += payload;
        }
      },
      // 嵌套module
      modules: {
        moduleA2: {
          namespaced: true,
          state: { newCount: 0 },
          mutations: {
            add(state, payload, rootState) {
              console.log('[moduleA2]', payload, rootState);
              state.newCount += payload;
            }
          }
        }
      }
    }
  }
});
