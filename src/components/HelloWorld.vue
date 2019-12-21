<template>

</template>

<script>
export default {
  data() {
    return {
      t: ''
    };
  },
  created() {
    var unixTimestamp = new Date(43552 * 1000);
    var commonTime = unixTimestamp.toLocaleString().substring(0, 9);
    console.log(commonTime);
  }
};
</script>

<style scoped>
</style>
