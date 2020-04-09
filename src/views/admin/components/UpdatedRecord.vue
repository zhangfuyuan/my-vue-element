<template>
  <div class="updated-record">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="$t('admin.versionName')" prop="versionName">
        <el-input v-model="form.versionName" :placeholder="placeholder.versionName" maxlength="48" show-word-limit />
      </el-form-item>
      <el-form-item :label="$t('admin.tbotChange')" prop="translationLanguage">
        <el-input v-model="form.translationLanguage" :placeholder="placeholder.translationLanguage" />
      </el-form-item>
      <el-form-item :label="$t('admin.remark')" prop="remark"><el-input v-model="form.remark" type="textarea" :placeholder="placeholder.remark" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">{{ $t('common.edit') }}</el-button>
        <el-button @click="resetForm('form')">{{ $t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ajaxUpdatedRecord } from '@/api/admin';

export default {
  name: 'UpdatedRecord',

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

  mounted() {
    this.form.versionName = this.transData.versionName;
    this.form.translationLanguage = this.transData.translationLanguage;
    this.form.remark = this.transData.remark;
  },

  destroyed() {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.translationLanguage = this.form.translationLanguage.replace(/，/g, ',');

          ajaxUpdatedRecord({ id: this.transData.id, ...this.form }).then(res => {
            const { errcode, data } = res;

            if (errcode === 0 && data) {
              if (this.$parent.$parent.editSucceed) this.$parent.$parent.editSucceed({ index: this.transData.index, ...this.form, updatedTime: data });
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
.updated-record {
}
</style>
