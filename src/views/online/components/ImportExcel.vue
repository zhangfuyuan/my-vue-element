<template>
  <div v-loading="uploadLoading" class="import-excel">
    <el-upload ref="upload" class="upload-demo" action="" drag :file-list="fileList" accept=".xls,.xlsx" :auto-upload="false" :show-file-list="false" :on-change="handleChange">
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        {{ $t('admin.importWordTips1') }}
        <em>{{ $t('admin.importWordTips2') }}</em>
      </div>
      <div slot="tip" class="el-upload__tip">{{ $t('admin.importWordTips3', { type: 'xls,xlsx' }) }}</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'ImportExcel',

  components: {},

  mixins: [],

  props: {
    transId: {
      type: String,
      default() {
        return '';
      }
    }
  },

  data() {
    return {
      fileList: [],
      uploader: null,
      uploadLoading: false
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    // 更新文件列表（触发）
    handleChange(file, fileList) {
      if (this.transId) {
        file.recordId = this.transId;
        this.fileList = fileList.slice(0);

        if (this.fileList.length > 0 && !this.uploadLoading && window.WebUploader) {
          this.uploadLoading = true;
          this.wuInit();
        }
      }
    },

    // 初始化 WebUploader 实例对象
    wuInit() {
      if (this.uploader) this.wuDestroy();

      this.uploader = window.WebUploader.create({
        swf: process.env.VUE_APP_PUBLIC_PATH + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
        server: process.env.VUE_APP_BASE_API + '/importExcel', // 文件接收服务端
        // server: 'http://192.168.14.201:11000/commServer/resource/upload', // 文件接收服务端
        thumb: false, // 不生成缩略图
        compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
        prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
        chunked: true // 分片上传
      });

      this.fileList.forEach((item, index) => {
        const { recordId, raw } = item;
        let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), raw);
        let newfile = new window.WebUploader.File(wuFile);

        newfile.recordId = recordId;
        this.uploader.addFiles(newfile);
        wuFile = null;
        newfile = null;
      });

      this.wuUpload();
    },

    // 触发 WebUploader 上传图片/视频资源
    wuUpload() {
      if (!this.uploader) return false;

      // this.uploader.on('uploadStart', file => {});

      this.uploader.on('uploadBeforeSend', (block, data) => {
        data.md5 = block.file.md5;
        data.recordId = block.file.recordId;
      });

      // this.uploader.on('uploadProgress', (file, percentage) => {});

      this.uploader.on('uploadError', (file, reason) => {
        console.log(`${file.name} : ${reason}`);

        this.uploadLoading = false;
        this.$message({
          showClose: true,
          message: this.$t('common.failedOperation'),
          type: 'error'
        });
      });

      this.uploader.on('uploadSuccess', (file, response) => {
        const { errcode, data } = response;

        if (errcode === 0 && data === 'success') {
          this.uploadLoading = false;

          if (this.$parent.$parent.importExcelSucceed) this.$parent.$parent.importExcelSucceed();
        } else if (errcode === 0 && data === 'upload_chunk') {
          // 分片文件上传成功时返回，啥也不做
        }
      });

      // this.uploader.on('uploadComplete', file => {});

      this.uploader.on('error', type => {
        console.log(`errorType：`, type);

        this.uploadLoading = false;
        this.$message({
          showClose: true,
          message: this.$t('common.failedOperation'),
          type: 'error'
        });
      });

      this.uploader.upload();
    },

    // 销毁 WebUploader 实例对象
    wuDestroy() {
      if (!this.uploader) return false;

      this.uploader.destroy();
      this.uploader = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.import-excel {
  .preview {
    padding: 0;
  }

  .preview li {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .preview-name {
      width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preview-input {
      width: 30%;
    }

    .el-icon-close {
      opacity: 0;
      color: #f56c6c;
      cursor: pointer;
    }

    &:hover {
      background-color: #f5f7fa;

      .preview-name {
        color: #409eff;
      }

      .el-icon-close {
        opacity: 1;
      }
    }
  }

  .upload {
    text-align: center;
  }
}
</style>
