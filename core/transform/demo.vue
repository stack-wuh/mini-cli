<!-- Test.vue -->
<template>
  <h1>{{ greeting }}</h1>
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      greeting: "Welcome!",
      message: "This is a test Vue file."
    };
  }
};
</script>

<style>
h1 {
  color: red;
}
p {
  font-size: 20px;
}
</style>
