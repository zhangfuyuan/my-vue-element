<template>
  <div class="online">
    <div class="bg" />
    <div>
      <img src="@/assets/images/__test.png" alt="__test">
    </div>
    <div>
      <img :src="errGif" width="1014" height="556" alt="Girl has dropped her ice cream.">
    </div>
  </div>
</template>

<script>
import png from '@/assets/404_images/404.png'

export default {
  name: 'Online',

  components: {},

  mixins: [],

  props: {},

  data() {
    return {
      errGif: png
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
