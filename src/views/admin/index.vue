<template>
  <div class="admin">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('common.add') }}</el-button>

      <div class="search">
        <el-date-picker
          v-model="tableQuery.searchDate"
          class="search-date"
          type="daterange"
          unlink-panels
          :start-placeholder="$t('common.startDate')"
          range-separator="~"
          :end-placeholder="$t('common.endDate')"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
        <el-input v-model="tableQuery.searchKey" class="search-input" maxlength="48" :placeholder="$t('admin.enterVersionName')" />
        <el-button class="search-button" type="primary" icon="el-icon-search" :disabled="tableLoading" @click="handleSearch">{{ $t('common.search') }}</el-button>
      </div>
    </div>

    <!-- 词条列表 -->
    <div class="list">
      <el-table v-loading="tableLoading" v-tabelLoadmore="tableLoadMore" :data="tableData" :height="tableHeight" fit stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="versionName" :label="$t('admin.versionName')" />
        <el-table-column :label="$t('admin.wordFile')">
          <template slot-scope="scope">
            <template v-if="scope.row.files && scope.row.files.length > 0">
              <div v-for="(item, index) in scope.row.files" :key="index">
                <el-link type="primary" icon="el-icon-download" :href="item.fileLink" target="_blank">{{ item.fileName }}</el-link>
                <span style="margin-left: 5px">({{ item.wordLanguage }})</span>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('admin.tbotChange')">
          <template slot-scope="scope">
            <template v-if="scope.row.translationLanguage && scope.row.translationLanguage.split(',')">
              <el-select v-model="scope.row.curTranslationLanguage" :placeholder="$t('admin.selectLanguage')" size="mini">
                <el-option v-for="(item, index) in scope.row.translationLanguage.split(',')" :key="index" :label="item" :value="item" />
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="updatedTime" :label="$t('admin.updatedTime')" width="160" />
        <el-table-column prop="remark" :label="$t('admin.remark')" width="100" />
        <el-table-column :label="$t('admin.handle')">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleImport(scope.$index, scope.row)">{{ $t('admin.importWord') }}</el-button>
            <el-dropdown>
              <el-button size="mini" plain class="more-dropdown">
                {{ $t('common.more') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-dropdown-item>
                <el-dropdown-item :disabled="!scope.row.files.length" @click.native="handleSet(scope.$index, scope.row)">{{ $t('admin.setWord') }}</el-dropdown-item>
                <el-dropdown-item :disabled="!scope.row.files.length" @click.native="handleLink(scope.$index, scope.row)">{{ $t('admin.createLink') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
      <component :is="dialogComponent" :trans-data="fatherData" />
    </el-dialog>
  </div>
</template>

<script>
import { CreateLink, CreateRecord, ImportWord, UpdatedRecord } from './components';
import { parseTime } from '@/utils/index.js';
import { getRecordList } from '@/api/admin';

export default {
  name: 'Admin',

  components: { CreateLink, CreateRecord, ImportWord, UpdatedRecord },

  mixins: [],

  props: {},

  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t('common.lastWeek'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('common.lastMonth'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('common.last3Month'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      tableData: [], // 表格数据
      tableLoading: true, // 表格是否正在加载数据
      dialogVisible: false, // 弹窗是否显示
      dialogComponent: '', // 弹窗子组件
      dialogTitle: '', // 弹窗标题
      fatherData: null, // 用于父子组件双向传递数据
      tableHeight: document.documentElement.clientHeight - 100,
      tableQuery: {
        searchKey: '',
        pageNo: 1,
        pageSize: 20,
        searchDate: ''
      },
      tableScrollBottom: false
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getTableData();
  },

  destroyed() {},

  methods: {
    // 加载表格数据
    getTableData(isReset) {
      const { searchKey, pageNo, pageSize, searchDate } = this.tableQuery;

      getRecordList({
        searchKey,
        pageNo: pageNo + '',
        pageSize: pageSize + '',
        beginDate: searchDate && searchDate[0],
        endDate: searchDate && searchDate[1]
      })
        .then(res => {
          const { errcode, data } = res;

          if (errcode === 0 && data) {
            if (isReset) this.tableData = data;
            else this.tableData.push(...data);

            if (data.length === 0) {
              this.tableScrollBottom = true;
              this.$message({
                showClose: true,
                message: this.$t('admin.allDataLoaded'),
                type: 'info'
              });
            }
          } else {
            this.$message({
              showClose: true,
              message: this.$t('common.failedOperation'),
              type: 'error'
            });
          }

          this.tableLoading = false;
        })
        .catch(_ => (this.tableLoading = false));
    },

    // 滚动懒加载
    tableLoadMore() {
      if (!this.tableLoading && !this.tableScrollBottom) {
        this.tableLoading = true;
        this.tableQuery.pageNo++;
        this.getTableData();
      }
    },

    // 搜索（触发）
    handleSearch() {
      this.tableScrollBottom = false;
      this.tableLoading = true;
      this.tableQuery.pageNo = 1;
      this.tableData = [];
      this.getTableData(true);
    },

    // 添加记录（触发）
    handleAdd() {
      this.dialogTitle = this.$t('common.add');
      this.dialogComponent = 'CreateRecord';
      this.dialogVisible = true;
    },

    // 添加记录成功
    addSucceed(data) {
      if (data) {
        this.tableData.unshift(data);
        this.closeDialog();
      }
    },

    // 导入词条（触发）
    handleImport(index, row) {
      const { id } = row;

      this.dialogTitle = this.$t('admin.importWord');
      this.dialogComponent = 'ImportWord';
      this.fatherData = { index, id };
      this.dialogVisible = true;
    },

    // 导入词条成功
    importSucceed(data) {
      if (data) {
        const { index, files } = data;

        if (files && files.length > 0) {
          if (!this.tableData[index].files) this.tableData[index].files = [];

          this.tableData[index].files.push(...files);
        }

        this.closeDialog();
        this.$message({
          showClose: true,
          message: this.$t('common.operateSuccessfully'),
          type: 'success'
        });
      }
    },

    // 编辑记录（触发）
    handleEdit(index, row) {
      const { id, versionName, translationLanguage, remark } = row;

      this.dialogTitle = this.$t('common.edit');
      this.dialogComponent = 'UpdatedRecord';
      this.fatherData = { index, id, versionName, translationLanguage, remark };
      this.dialogVisible = true;
    },

    // 编辑记录成功
    editSucceed(data) {
      if (data) {
        const { index, versionName, translationLanguage, updatedTime, remark } = data;

        this.tableData[index].versionName = versionName;
        this.tableData[index].translationLanguage = translationLanguage;
        this.tableData[index].updatedTime = updatedTime || parseTime(Date.now());
        this.tableData[index].remark = remark;
        this.closeDialog();
      }
    },

    // 设置词条（触发）
    handleSet(index, row) {
      const { id, curTranslationLanguage } = row;
      const query = { id: encodeURIComponent(id), edit: '1' };

      if (curTranslationLanguage) query.translationLanguage = encodeURIComponent(curTranslationLanguage);

      const { href } = this.$router.resolve({ path: '/online', query });
      window.open(href, '_blank');
    },

    // 生成链接（触发）
    handleLink(index, row) {
      const { id, curTranslationLanguage } = row;

      this.dialogTitle = this.$t('admin.createLink');
      this.dialogComponent = 'CreateLink';
      this.fatherData = { id, translationLanguage: curTranslationLanguage };
      this.dialogVisible = true;
    },

    // 关闭弹窗前（触发）二次确认
    handleBeforeClose(done) {
      if (this.dialogComponent === 'CreateLink') {
        done();
      } else {
        this.$confirm(this.$t('common.confirmClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
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
      this.fatherData = null;
    }
  }
};
</script>

<style src="./global.scss" lang="scss"></style>
<style src="./index.scss" lang="scss" scoped></style>
