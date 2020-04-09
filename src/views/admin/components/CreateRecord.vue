<template>
  <div class="create-record">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="$t('admin.versionName')" prop="versionName">
        <el-input v-model="form.versionName" :placeholder="placeholder.versionName" maxlength="48" show-word-limit />
      </el-form-item>
      <el-form-item :label="$t('admin.tbotChange')" prop="translationLanguage">
        <el-input v-model="form.translationLanguage" :placeholder="placeholder.translationLanguage" />
      </el-form-item>
      <el-form-item :label="$t('admin.remark')" prop="remark"><el-input v-model="form.remark" type="textarea" :placeholder="placeholder.remark" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">{{ $t('common.add') }}</el-button>
        <el-button @click="resetForm('form')">{{ $t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ajaxCreateRecord } from '@/api/admin';

export default {
  name: 'CreateRecord',

  components: {},

  mixins: [],

  props: {},

  data() {
    return {
      form: {
        versionName: '',
        translationLanguage: '',
        remark: ''
      },
      placeholder: {
        versionName: this.$t('admin.versionNamePlaceholder'),
        translationLanguage: this.$t('admin.translationLanguagePlaceholder'),
        remark: this.$t('admin.remarkPlaceholder')
      },
      rules: {
        versionName: [
          { required: true, message: this.$t('admin.versionNameRequired'), trigger: 'blur' },
          { min: 3, max: 48, message: this.$t('admin.versionNameLimit', { min: 3, max: 48 }), trigger: 'blur' }
        ]
      }
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.translationLanguage = this.form.translationLanguage.replace(/，/g, ',');

          ajaxCreateRecord(this.form).then(res => {
            const { errcode, data } = res;

            if (errcode === 0 && data) {
              if (this.$parent.$parent.addSucceed) this.$parent.$parent.addSucceed(data);
            } else {
              this.$message({
                showClose: true,
                message: this.$t('common.failedOperation'),
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.create-link {
}
</style>
