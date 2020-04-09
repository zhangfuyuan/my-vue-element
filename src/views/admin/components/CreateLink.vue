<template>
  <div class="create-link">
    <el-input ref="linkInput" v-model="input" class="link-input" readonly />
    <el-button type="primary" @click="handleCopy">{{ $t('common.copy') }}</el-button>
  </div>
</template>

<script>
import { ajaxCreateLink } from '@/api/admin';

export default {
  name: 'CreateLink',

  components: {},

  mixins: [],

  props: {
    transData: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data() {
    return {
      input: ''
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    const { id, translationLanguage } = this.transData;
    console.log(id, translationLanguage);
    let link = `${window.location.origin + '' + process.env.VUE_APP_PUBLIC_PATH}#/online?id=${encodeURIComponent(id)}`;
    const ajaxOption = { id };

    if (translationLanguage) {
      link += `&translationLanguage=${encodeURIComponent(translationLanguage)}`;
      ajaxOption.translationLanguage = encodeURIComponent(translationLanguage);
    }

    this.input = link;

    ajaxCreateLink(ajaxOption).then(res => {
      const { errcode, data } = res;

      if (errcode === 0 && data) this.input = data;
    });
  },

  destroyed() {},

  methods: {
    // 复制（触发）
    handleCopy() {
      const _input = document.createElement('input'); // 直接构建input
      _input.value = this.$refs['linkInput'].value; // 设置内容
      document.body.appendChild(_input); // 添加临时实例
      _input.select(); // 选择实例内容
      document.execCommand('Copy'); // 执行复制
      document.body.removeChild(_input); // 删除临时实例
      this.$message({
        showClose: true,
        message: this.$t('admin.copySuccess'),
        type: 'success'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.create-link {
  width: 100%;
  display: flex;
  align-items: center;

  .link-input {
    margin-right: 20px;
    width: 50%;
  }
}
</style>
