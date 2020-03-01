<template>
  <div id="app">
    <transition mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

