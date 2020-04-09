<template>
  <div v-loading="uploadLoading" class="import-word">
    <el-upload
      ref="upload"
      class="upload-demo"
      action=""
      drag
      :file-list="fileList"
      accept=".xml,.properties"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        {{ $t('admin.importWordTips1') }}
        <em>{{ $t('admin.importWordTips2') }}</em>
      </div>
      <div slot="tip" class="el-upload__tip">{{ $t('admin.importWordTips3', { type: 'xml,properties' }) }}</div>
    </el-upload>

    <ul class="preview">
      <li v-for="(item, index) in fileList" :key="item.uid || index">
        <span class="preview-name">{{ item.name }}</span>
        <el-input v-model="item.wordLanguage" class="preview-input" size="mini" :placeholder="$t('admin.wordLanguagePlaceholder')" />
        <i class="el-icon-close" @click="handleRemove(index)" />
      </li>
    </ul>

    <div class="upload">
      <el-button size="small" type="success" :disabled="fileList.length === 0" @click="handleUpload">{{ $t('admin.uploadServer') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportWord',

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
      fileList: [],
      uploader: null,
      uploadLoading: false,
      uploadCompleteNum: 0
      // subData: null
    };
  },

  computed: {},

  watch: {
    // transData(val) {
    //   console.log('父影响子', val);
    //   this.subData = val;
    // },
    // subData(val) {
    //   console.log('子影响父', val);
    //   this.$emit('input', val);
    // }
  },

  created() {},

  mounted() {},

  destroyed() {},

  methods: {
    // 更新文件列表（触发）
    handleChange(file, fileList) {
      if (this.transData) {
        const { id } = this.transData;
        const { name } = file;

        file.recordId = id;
        file.fileName = name;
        this.fileList = fileList.slice(0);
      }
    },

    // 移除列表中的文件（触发）
    handleRemove(index) {
      this.fileList.splice(index, 1);
    },

    // 上传文件（触发）
    handleUpload() {
      if (this.fileList.length > 0 && !this.uploadLoading && window.WebUploader) {
        this.uploadLoading = true;
        this.wuInit();
      }
    },

    // 判断是否全部文件上传完成
    verdictUploadComplete() {
      if (this.uploadCompleteNum >= this.fileList.length && this.$parent.$parent.importSucceed) {
        const { index } = this.transData;
        const files = [];

        this.fileList.forEach(item => {
          const { fileName, fileLink, wordLanguage } = item;

          files.push({ fileName, fileLink, wordLanguage });
        });

        this.uploadLoading = false;
        this.$parent.$parent.importSucceed({ index, files });
      }
    },

    // 初始化 WebUploader 实例对象
    wuInit() {
      if (this.uploader) this.wuDestroy();

      this.uploader = window.WebUploader.create({
        swf: process.env.VUE_APP_PUBLIC_PATH + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
        server: process.env.VUE_APP_BASE_API + '/importWord', // 文件接收服务端
        // server: 'http://192.168.14.201:11000/commServer/resource/upload', // 文件接收服务端
        thumb: false, // 不生成缩略图
        compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
        prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
        chunked: true // 分片上传
      });

      this.fileList.forEach((item, index) => {
        const { recordId, raw, wordLanguage } = item;
        let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), raw);
        let newfile = new window.WebUploader.File(wuFile);

        newfile.recordId = recordId;
        newfile.wordLanguage = wordLanguage;
        newfile.index = index;
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
        data.wordLanguage = block.file.wordLanguage;
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

        if (errcode === 0 && data && data.fileLink) {
          this.fileList[file.index].fileLink = data.fileLink;
          this.uploadCompleteNum++;
          this.verdictUploadComplete();
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
.import-word {
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
