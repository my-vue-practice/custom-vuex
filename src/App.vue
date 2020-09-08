<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
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
    <p>getters doubleCount: {{ $store.getters.doubleCount }}</p>
    <p>getters doubleDoubleCount: {{ $store.getters.doubleDoubleCount }}</p>
  </div>
</template>

<script>
export default {
  name: 'App'
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
