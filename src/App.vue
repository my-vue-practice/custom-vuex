<template>
  <div id="app">
    <img width="100" alt="Vue logo" src="./assets/logo.png" /><br />
    <button @click="$store.commit('add', 1)">+1</button>&nbsp;&nbsp;
    <button @click="add(1)">mapMutations +1</button>&nbsp;&nbsp;
    <button @click="minus({ amount: 1 })">-1</button>&nbsp;&nbsp;
    <button @click="$store.dispatch('addAsync', 1)">async +1</button>&nbsp;&nbsp;
    <button @click="addAsync(1)">mapActions async +1</button>&nbsp;&nbsp;
    <button @click="$store.commit('double')">*2</button>
    <p>{{ $store.state.count }}</p>
    <br />
    <h3>computed data:</h3>
    <!-- mapState数组形式 -->
    <p>mapState count: {{ count }}</p>
    <!-- mapState对象形式 -->
    <!-- <p>mapState computedCount: {{ computedCount }}</p>
    <p>computedCountAddGettersDoubleCount: {{ computedCountAddGettersDoubleCount }}</p> -->
    <p>todoText2: {{ todoText2 }}</p>
    <br />
    <h3>getters data:</h3>
    <p>getters property doubleCount: {{ $store.getters.doubleCount }}</p>
    <p>getters property doubleDoubleCount: {{ $store.getters.doubleDoubleCount }}</p>
    <p>getters function getTodoById: {{ todoText }}</p>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from 'vuex';
import { mapState, mapMutations, mapActions } from './xstore/xvuex';
export default {
  name: 'App',
  data() {
    return {
      todoText: ''
    };
  },
  mounted() {
    // this.$store.state = {};
    // console.log(this.$store.state);
    this.todoText = this.$store.getters.getTodoById(2).text;
  },
  methods: {
    ...mapMutations(['add', 'minus']),
    // ...mapMutations({
    //   add: 'add', // add(1) => this.$store.commit('add', 1)
    //   minus: 'minus'
    // }),
    ...mapActions(['addAsync']), // addAsync(1) => this.$store.dispatch('addAsync', 1)
    test() {
      console.log('test');
    }
  },
  // 数组形式
  computed: {
    ...mapState(['count']),
    todoText2() {
      return this.todoText + '@@@';
    }
  }
  // 对象形式
  // computed: mapState({
  //   // computedCount: state => state.count,
  //   // 上面简写形式：
  //   computedCount: 'count',
  //   computedCountAddGettersDoubleCount: (state, getters) => state.count + getters.doubleCount
  // })
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
