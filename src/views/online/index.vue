<template>
  <div class="online">
    <div class="header">
      <div class="saved-time">
        {{ $t('online.lastSavedTime') }}
        <span>{{ savedTime }}</span>
      </div>

      <div class="toolbar">
        <a ref="download" href="" target="_blank" />
        <el-button size="small" :disabled="!hotInstance" type="success" @click="handleExportXML">{{ $t('online.exportXML') }}</el-button>
        <el-button size="small" :disabled="!hotInstance" @click="handleExportExcel">{{ $t('online.exportExcel') }}</el-button>
        <el-button size="small" :disabled="!hotInstance" @click="handleImportExcel">{{ $t('online.importExcel') }}</el-button>
        <el-button ref="saveBtn" size="small" type="primary" :disabled="isSaved" @click="handleSave">{{ $t('common.save') }}</el-button>
      </div>
    </div>

    <div class="main"><hot-table ref="hotTable" class="my-table" :settings="settings" :language="language" license-key="non-commercial-and-evaluation" /></div>

    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      width="50%"
      @close="handleClose"
    >
      <component :is="dialogComponent" :trans-id="submitData.id" />
    </el-dialog>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue';
import Handsontable from 'handsontable';
import 'handsontable/languages/zh-CN';
// import { parseTime } from '@/utils/index.js';
import { getWordDetail, ajaxSaveWordDetail, ajaxExportXML, ajaxExportExcel /*, ajaxImportExcel*/ } from '@/api/online';
import { ImportExcel } from './components';

export default {
  name: 'Online',

  components: { HotTable, ImportExcel },

  mixins: [],

  props: {},

  data() {
    return {
      settings: {
        data: [['Loading...']],
        rowHeaders: true,
        colHeaders: true,
        contextMenu: ['undo', 'redo', 'alignment', '---------', 'cut', 'copy'],
        manualColumnResize: true,
        manualRowResize: true,
        width: '100%',
        stretchH: 'all'
      },
      language: 'en-US',
      submitData: {
        id: '',
        edit: '',
        translationLanguage: '',
        transcript: {},
        limit: {}
      },
      wordKeyMap: {},
      transcriptColIndex: -1,
      limitColIndex: -1,
      savedTime: '--',
      hotInstance: null,
      isKeydownCtrlS: false,
      errorWordList: [],
      isSaved: true,
      msgInstance: null,
      fatherDialogVisible: false,
      dialogTitle: '',
      dialogComponent: '',
      dialogVisible: false
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    document.addEventListener('keydown', this.handleCtrlS, false);
    const query = this.$route.query;

    if (this.$i18n.locale === 'zh') this.language = 'zh-CN';

    if (query) {
      const { id, edit, translationLanguage } = query;

      this.submitData.id = decodeURIComponent(id);
      if (edit) this.submitData.edit = edit + '';
      if (translationLanguage) this.submitData.translationLanguage = decodeURIComponent(translationLanguage);
    }

    this.initHotTable();
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleCtrlS);
    Handsontable.hooks.remove('beforeChange', this.handleBeforeKeyDown, this.hotInstance);
    Handsontable.hooks.remove('afterChange', this.handleAfterChange, this.hotInstance);
    this.hotInstance = null;
  },

  methods: {
    // 初始化Excel表格
    initHotTable() {
      const { id, edit, translationLanguage } = this.submitData;

      getWordDetail({ id, edit, translationLanguage }).then(res => {
        if (res.errcode === 0 && res.data) {
          const { edit, translationLanguage, word, transcript, limit } = res.data;
          const wordLangKeys = (word && Object.keys(word)) || null;
          const wordLangLen = (wordLangKeys && wordLangKeys.length) || 0;

          if (wordLangLen) {
            let data = null;
            let colHeaders = [...wordLangKeys, translationLanguage || ''];
            const columns = [{ readOnly: true }]; // 词条首列只读
            const firstWordLangKeys = wordLangKeys[0];
            const firstWord = word[firstWordLangKeys];
            const otherWordLangKeys = wordLangKeys.slice(1);
            const hasOtherWordLang = (otherWordLangKeys && otherWordLangKeys.length > 0) || false;
            const isEdit = edit === '1';
            const warnWordList = [];

            data = Object.keys(firstWord).map((key, index) => {
              let wordVal = firstWord[key];
              const row = [wordVal]; // 词条首列
              let strLimit = limit[key];
              const isLimit = strLimit > -1;
              strLimit = isLimit ? strLimit : wordVal.length;

              if (hasOtherWordLang) {
                otherWordLangKeys.map(lang => {
                  wordVal = word[lang][key];
                  row.push(wordVal); // 多语言词条列
                  if (index === 0) columns.push({ readOnly: true }); // 多语言词条列只读

                  if (!isLimit && wordVal.length > strLimit) strLimit = wordVal.length;
                });
              }

              row.push(transcript[key]); // 翻译列
              if (index === 0) columns.push({}); // 翻译列可写

              if (isEdit) {
                row.push(limit[key]); // 设置长度限制列
                if (index === 0) columns.push({}); // 设置长度限制列可写
              }

              row.push(strLimit); // 显示长度限制列
              if (index === 0) columns.push({ readOnly: true }); // 显示长度限制列只读

              this.wordKeyMap[index] = key;
              const validType = transcript[key].length > strLimit ? (isLimit ? 'error' : 'warn') : 'valid';

              if (validType === 'error') {
                this.errorWordList.push(`${index},${wordLangLen}`);
              } else if (validType === 'warn') {
                warnWordList.push(`${index},${wordLangLen}`);
              }

              return row;
            });

            if (isEdit) colHeaders = colHeaders.concat([this.$t('online.setLengthLimit'), this.$t('online.lengthLimit')]);
            else colHeaders.push(this.$t('online.lengthLimit'));

            this.settings.columns = columns;
            this.settings.colHeaders = colHeaders;
            this.hotInstance = this.$refs['hotTable'].hotInstance;
            Handsontable.hooks.add('beforeKeyDown', this.handleBeforeKeyDown, this.hotInstance);
            Handsontable.hooks.add('afterChange', this.handleAfterChange, this.hotInstance);
            this.submitData.transcript = transcript;
            this.submitData.limit = limit;
            this.transcriptColIndex = wordLangLen;

            if (isEdit) this.limitColIndex = wordLangLen + 1;

            this.$nextTick(_ => {
              this.settings.data = data;

              this.$nextTick(_ => {
                let needRender = false;

                if (this.errorWordList.length > 0) {
                  needRender = true;

                  this.errorWordList.forEach(item => {
                    const [row, col] = item.split(',');

                    this.hotInstance.setCellMeta(row, col, 'className', (this.hotInstance.getCellMeta(row, col).className || '') + ' error-word');
                  });
                }

                if (warnWordList.length > 0) {
                  needRender = true;

                  warnWordList.forEach(item => {
                    const [row, col] = item.split(',');

                    this.hotInstance.setCellMeta(row, col, 'className', (this.hotInstance.getCellMeta(row, col).className || '') + ' warn-word');
                  });
                }

                if (needRender) this.hotInstance.render();
              });
            });
          }
        }
      });
    },

    // 修改Excel单元格前（触发）
    handleBeforeKeyDown(e) {
      this.isSaved = false;
    },

    // 修改Excel单元格后（触发）
    handleAfterChange(changes) {
      if (changes) {
        let isChange = false;
        const invalidClassReg = new RegExp('(\\s|^)(warn-word|error-word)(\\s|$)');
        const errorClassReg = new RegExp('(\\s|^)error-word(\\s|$)');
        const { transcript, limit } = this.submitData;
        const transcriptColIndex = this.transcriptColIndex;

        changes.forEach(([row, col, oldValue, newValue]) => {
          if (oldValue !== newValue) {
            isChange = true;
            const key = this.wordKeyMap[row];
            const data = this.settings.data[row];
            const className = this.hotInstance.getCellMeta(row, transcriptColIndex).className || '';
            const rowCol = `${row},${transcriptColIndex}`;
            let newValueLen = '';

            if (col === transcriptColIndex) {
              // 修改了翻译列的单元格
              transcript[key] = newValue || '';
              newValueLen = (newValue && newValue.length) || 0;
            }

            if (col === this.limitColIndex) {
              // 修改了设置长度限制列的单元格
              const newValueNum = parseInt(newValue);
              const newValueNum2 = isNaN(newValueNum) ? -1 : newValueNum;

              if (newValueNum + '' !== newValue + '') data[col] = newValueNum2;

              limit[key] = newValueNum2;
              data[data.length - 1] = newValueNum2 <= -1 ? data[0].length : newValueNum2;
              newValueLen = (data[transcriptColIndex] && data[transcriptColIndex].length) || 0;
            }

            const validType = newValueLen > parseInt(data[data.length - 1]) ? (limit[key] > -1 ? 'error' : 'warn') : 'valid';
            const classType = className && className.match(invalidClassReg) ? (className.match(errorClassReg) ? 'error' : 'warn') : 'valid';
            const errorWordListIndex = this.errorWordList.indexOf(rowCol);

            if (validType === 'error') {
              if (classType === 'warn') {
                this.hotInstance.setCellMeta(row, transcriptColIndex, 'className', className.replace(invalidClassReg, 'error-word'));
              } else if (classType !== 'error') {
                this.hotInstance.setCellMeta(row, transcriptColIndex, 'className', className + ' error-word');
              }

              if (errorWordListIndex === -1) this.errorWordList.push(rowCol);
            } else if (validType === 'warn') {
              if (classType === 'error') {
                this.hotInstance.setCellMeta(row, transcriptColIndex, 'className', className.replace(invalidClassReg, 'warn-word'));
              } else if (classType !== 'warn') {
                this.hotInstance.setCellMeta(row, transcriptColIndex, 'className', className + ' warn-word');
              }

              if (errorWordListIndex > -1) this.errorWordList.splice(errorWordListIndex, 1);
            } else {
              if (classType === 'error' || classType === 'warn') {
                this.hotInstance.setCellMeta(row, transcriptColIndex, 'className', className.replace(invalidClassReg, ' '));
              }

              if (errorWordListIndex > -1) this.errorWordList.splice(errorWordListIndex, 1);
            }
          }
        });

        if (isChange) {
          this.isSaved = false;
          this.saveSumbit(this.isKeydownCtrlS);
          this.hotInstance.render();
        }
      }
    },

    // 保存数据（触发）
    handleSave() {
      const { edit, transcript, limit } = this.submitData;

      Object.keys(this.wordKeyMap).map(row => {
        const key = this.wordKeyMap[row];
        const data = this.settings.data[row];

        transcript[key] = data[this.transcriptColIndex] || '';

        if (edit === '1') {
          const curLimit = parseInt(data[this.limitColIndex]);
          limit[key] = isNaN(curLimit) ? -1 : curLimit;
        }
      });

      this.saveSumbit(true);
    },

    // Ctrl + S 阻止浏览器默认行为（触发）
    handleCtrlS(e) {
      // 可以判断是不是mac，如果是mac,ctrl变为花键
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        // event.preventDefault() 方法阻止元素发生默认的行为。
        e.preventDefault();

        // 目的是手动失焦，触发 hooks
        if (this.hotInstance) {
          const selected = this.hotInstance.getSelectedLast();

          if (selected) {
            const [, , endRow, endCol] = selected;

            this.isKeydownCtrlS = true;
            this.hotInstance.selectCell(endRow + 1, endCol, endRow + 1, endCol);
            this.$refs['saveBtn'].$el.click();
            this.isKeydownCtrlS = false;
          }
        }
      }
    },

    // 保存的数据校验及提交
    saveSumbit(isShowMsg) {
      if (this.errorWordList.length === 0) {
        const { id, edit, transcript, limit } = this.submitData;

        ajaxSaveWordDetail({ id, edit, transcript: JSON.stringify(transcript), limit: JSON.stringify(limit) }).then(res => {
          const { errcode, data } = res;

          if (errcode === 0 && data) {
            this.savedTime = data;

            if (isShowMsg) {
              this.isSaved = true;
              if (this.msgInstance) this.msgInstance.close();
              this.msgInstance = this.$message({
                showClose: true,
                message: this.$t('online.saveSuccess'),
                type: 'success'
              });
            }
          } else if (isShowMsg) {
            if (this.msgInstance) this.msgInstance.close();
            this.msgInstance = this.$message({
              showClose: true,
              message: this.$t('common.failedOperation'),
              type: 'error'
            });
          }
        });
      } else if (isShowMsg) {
        if (this.msgInstance) this.msgInstance.close();
        this.msgInstance = this.$message({
          showClose: true,
          message: this.$t('online.saveFailedTips'),
          type: 'error'
        });
      }
    },

    // 导出XML（触发）
    handleExportXML() {
      ajaxExportXML({ id: this.submitData.id }).then(res => {
        const { errcode, data } = res;

        if (errcode === 0 && data) {
          this.$refs['download'].href = data;
          this.$refs['download'].click();
        }
      });
    },

    // 导出Excel（触发）
    handleExportExcel() {
      ajaxExportExcel({ id: this.submitData.id }).then(res => {
        const { errcode, data } = res;

        if (errcode === 0 && data) {
          this.$refs['download'].href = data;
          this.$refs['download'].click();
        }
      });
    },

    // 导入Excel（触发）
    handleImportExcel() {
      this.dialogTitle = this.$t('online.importExcel');
      this.dialogComponent = 'ImportExcel';
      this.dialogVisible = true;
    },

    // 导入Excel成功
    importExcelSucceed() {
      this.closeDialog();
      this.$message({
        showClose: true,
        message: this.$t('common.operateSuccessfully'),
        type: 'success'
      });

      setTimeout(_ => {
        window.location.reload();
      }, 1000);
    },

    // 关闭弹窗前（触发）二次确认
    handleBeforeClose(done) {
      this.$confirm(this.$t('common.confirmClose'))
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // 手动关闭弹窗
    closeDialog() {
      this.$nextTick(_ => {
        this.dialogVisible = false;
      });
    },

    // 关闭弹窗后（触发）
    handleClose() {
      this.dialogTitle = '';
      this.dialogComponent = '';
    }
  }
};
</script>

<style src="./handsontable.full.min.css"></style>
<style src="./global.scss" lang="scss"></style>
<style src="./index.scss" lang="scss" scoped></style>
