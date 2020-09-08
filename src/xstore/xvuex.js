let Vue;

class XStore {
  constructor(options) {
    console.log('[options]', options);
    // // 非响应式state无法触发dom更新。
    // this.state = options.state;
    // // state必须是响应式的
    // this.state = new Vue({
    //   data() {
    //     return options.state;
    //   }
    // });
    // 将state设置更加严格，防止用户直接修改state
    this._vm = new Vue({
      data() {
        return {
          $$state: options.state
        };
      }
    });
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters;
    // 纠正this指向
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    // update getters
    this.getters = {};
    Object.keys(this._getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => this._getters[key](this.state, this.getters)
      });
    });
  }

  get state() {
    return this._vm._data.$$state;
  }
  set state(v) {
    console.warn('[xvuex warn] use commit(mutation) for update state!');
  }
  commit(type, payload) {
    this._mutations[type] && this._mutations[type](this.state, payload);
  }

  dispatch(type, payload) {
    this._actions[type] && this._actions[type](this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

export default {
  Store: XStore,
  install
};
