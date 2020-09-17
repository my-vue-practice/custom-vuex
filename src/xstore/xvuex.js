/** 工具函数 */
const Utils = {
  isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }
};

const Helpers = {
  unifyObjectStyle(type, payload, options) {
    if (Utils.isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    return { type, payload, options };
  }
};

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
    // // 将state设置更加严格，防止用户直接修改state
    // this._vm = new Vue({
    //   data() {
    //     return {
    //       $$state: options.state
    //     };
    //   }
    // });

    this._options = options;
    this._mutations = options.mutations;
    this._actions = options.actions;
    this._getters = options.getters;
    this._modules = options.modules;
    // 纠正this指向
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    this._initState();

    // update getters
    this.getters = {};
    Object.keys(this._getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => this._getters[key](this.state, this.getters)
      });
    });
  }

  /** state等于rootState加modulesState */
  _initState() {
    let rootState = this._options.state;
    rootState = (typeof rootState === 'function' ? rootState() : rootState) || {};

    const modulesState = {};
    if (Utils.isObject(this._modules)) {
      Object.keys(this._modules).forEach(key => {
        console.log('key>>', key);
        const state = this._modules[key].state;
        modulesState[key] = (typeof state === 'function' ? state() : state) || {};
      });
    }

    // 将state设置更加严格，防止用户直接修改state
    this._vm = new Vue({
      data() {
        return {
          $$state: {
            ...rootState,
            ...modulesState
          }
        };
      }
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
  commit(_type, _payload, _options) {
    const { type, payload } = Helpers.unifyObjectStyle(_type, _payload, _options);

    return this._mutations[type] && this._mutations[type](this.state, payload);
  }

  /**
   * 异步提交mutation
   * @example
   * 1. dispatch(type, payload)
   * 2. dispatch({type, payload})
   */
  dispatch(_type, _payload, _options) {
    const { type, payload } = Helpers.unifyObjectStyle(_type, _payload, _options);
    return this._actions[type] && this._actions[type](this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      // if (this.$options.store) {
      //   Vue.prototype.$store = this.$options.store;
      // }

      // 实现优化
      const options = this.$options;
      const store = options.store;
      if (store) {
        // 组件内部设定了store,则优先使用组件内部的store
        this.$store = typeof store === 'function' ? store() : store;
      } else if (options.parent && options.parent.$store) {
        // 组件内部没有设定store,则从根App.vue下继承$store方法
        this.$store = options.parent.$store;
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
  } else if (Utils.isObject(options)) {
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

// 柯里化 curring
function mapFuncWrap(func) {
  return options => {
    let obj = {};
    let opts = {};
    if (Array.isArray(options)) {
      options.forEach(t => (opts[t] = t));
    } else if (Utils.isObject(options)) {
      opts = { ...options };
    }
    Object.keys(opts).forEach(type => {
      obj[type] = function(payload) {
        // this.$store.dispatch(type, payload);
        func.call(this, type, payload);
      };
    });

    return obj;
  };
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
const mapActions = mapFuncWrap(function(type, payload) {
  this.$store.dispatch(type, payload);
});

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
const mapMutations = mapFuncWrap(function(type, payload) {
  this.$store.commit(type, payload);
});

// 使用mapXXX辅助函数进行映射前，必须先将store对象注入到根节点上。这样才能使用this.$store
export { mapState, mapMutations, mapActions };

export default {
  Store: XStore,
  install,
  mapState
};
