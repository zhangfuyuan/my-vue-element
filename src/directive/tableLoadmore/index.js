import Vue from 'vue'

const tabelLoadmore = function() {
  // v-loadmore: 用于在element-ui的select下拉框加上滚动到底事件监听
  Vue.directive('tabelLoadmore', {
    bind(el, binding) {
      // 获取element-ui定义好的scroll盒子
      const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');

      SELECTWRAP_DOM.addEventListener('scroll', function() {
        /*
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const sign = 80; // 定义默认的向上滚于乡下滚的边界
        const scrollRest = Math.floor(this.scrollHeight) - Math.floor(this.scrollTop); // 滚动剩余部分
        const clientHeight = Math.floor(this.clientHeight + 15); // 可视区域高度
        const CONDITION = ((scrollRest <= clientHeight) && (Math.floor(this.scrollTop) > sign)); // 注意: && this.scrollTop 而且都要取整

        if (CONDITION) binding.value();
      });
    }
  })
}

tabelLoadmore()
export default tabelLoadmore
