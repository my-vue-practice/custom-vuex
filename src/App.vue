<template>
  <div id="app">
    <img width="100" alt="Vue logo" src="./assets/logo.png" />
    <p>
      count:
      <button @click="$store.commit('ADD', 1)">{{ $store.state.count }}</button>
    </p>
    <p>
      async count:
      <button @click="$store.dispatch('ADD', 1)">{{ $store.state.count }}</button>
    </p>
    <p>
      double count:
      <button @click="$store.commit('DOUBLE')">{{ $store.state.count }}</button>
    </p>
    <br />
    <h3>getters data:</h3>
    <p>getters property doubleCount: {{ $store.getters.doubleCount }}</p>
    <p>getters property doubleDoubleCount: {{ $store.getters.doubleDoubleCount }}</p>
    <p>getters function getTodoById: {{ todoText }}</p>
    <br />
    <h3>computed data:</h3>
    <!-- mapState数组形式 -->
    <p>count: {{ count }}</p>
    <!-- mapState对象形式 -->
    <!-- <p>computedCount: {{ computedCount }}</p>
    <p>computedCountAddGettersDoubleCount: {{ computedCountAddGettersDoubleCount }}</p> -->
  </div>
</template>

<script>
import { mapState } from './xstore/xvuex';
export default {
  name: 'App',
  data() {
    return {
      todoText: ''
    };
  },
  mounted() {
    this.$store.state = {};
    console.log(this.$store.state);
    this.todoText = this.$store.getters.getTodoById(2).text;
  },
  // 数组形式
  computed: mapState(['count'])
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
