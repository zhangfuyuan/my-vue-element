<template>
  <div class="admin">
    <el-button type="primary" @click="ajax">Ajax</el-button>
    {{ ajaxMsg }}
  </div>
</template>

<script>
import { __test } from '@/api/__test'

export default {
  name: 'Admin',

  components: {},

  mixins: [],

  props: {},

  data() {
    return {
      ajaxMsg: ''
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    ajax() {
      __test().then(res => {
        this.ajaxMsg = res.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
