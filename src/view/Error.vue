<template>
  <section class="container">
    <p>Entering this Page means you have been 404.</p>
    <p @click="goBackHome"><u>Click here to return Home.</u></p>
  </section>
</template>
<script>
export default {
  methods: {
    goBackHome() {
      this.$router.push("/");
    },
  },
};
</script>
