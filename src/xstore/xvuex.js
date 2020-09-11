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
  /**
   * 提交mutation
   * @example
   * 1. commit(type, payload)
   * 2. commit({type, payload})
   */
  commit(type, payload) {
    // if (typeof type === 'string') {
    //   this._mutations[type] && this._mutations[type](this.state, payload);
    // } else
    if (type !== null && typeof type === 'object') {
      payload = type;
      type = payload.type;
    }
    this._mutations[type] && this._mutations[type](this.state, payload);
  }

  /**
   * 异步提交mutation
   * @example
   * 1. dispatch(type, payload)
   * 2. dispatch({type, payload})
   */
  dispatch(type, payload) {
    if (type !== null && typeof type === 'object') {
      payload = type;
      type = payload.type;
    }
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
/**
 *
 * @param {object} options
 * @example
 * exp1:
 * {
 *  a: state => state.a,
 *  b: (state, getters) => state.b + getters.c
 * }
 * exp2:
 * ['a', 'b']
 */
function mapState(options) {
  let obj = {};
  if (Array.isArray(options)) {
    // 数组
    options.forEach(key => {
      // 为了this指向当前组件实例，这里不能用箭头函数。
      obj[key] = function() {
        // 巧妙的运用this获取组件实例，从而从实例上面获取$store
        return this.$store.state[key];
      };
    });
  } else if (options !== null && typeof options === 'object') {
    // object
    Object.keys(options).forEach(key => {
      // 为了this指向当前组件实例，这里不能用箭头函数。
      obj[key] = function() {
        const v = options[key];
        const st = this.$store.state;
        const gt = this.$store.getters;
        // 巧妙的运用this获取组件实例，从而从实例上面获取$store
        return typeof v === 'string' ? st[v] : v.call(this, st, gt);
      };
    });
  }
  console.log('[mapState obj]', obj);
  return obj;
}

/**
 *
 * @param {object} options
 * @example
 * exp1:
 * {
 *  funcA: 'a',
 *  funcB: 'b'
 * }
 * exp2:
 * ['a', 'b']
 */
function mapMutations(options) {
  let obj = {};
  let opts = {};
  if (Array.isArray(options)) {
    options.forEach(k => (opts[k] = k));
  }
  if (options !== null && typeof options === 'object') {
    opts = { ...options };
  }
  Object.keys(opts).forEach(key => {
    obj[key] = function(payload) {
      this.$store.commit(opts[key], payload);
    };
  });
  return obj;
}

export { mapState, mapMutations };

export default {
  Store: XStore,
  install,
  mapState
};
