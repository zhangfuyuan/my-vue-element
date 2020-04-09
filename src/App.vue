<template>
  <div id="app"><router-view /></div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {};
  },
  created() {
    // todo 只能在这里 register 注册 WebUploader，否则会重复注册！
    // let self = this;

    // WebUploader.Uploader.register 内必须备份外层 this 为 self
    window.WebUploader.Uploader.register(
      {
        'before-send-file': 'beforeSendFile'
      },
      {
        beforeSendFile(file) {
          const deferred = window.WebUploader.Deferred();

          new window.WebUploader.Uploader().md5File(file).then(val => {
            // window.console.log(`${file.name} md5：${val}`);

            file.md5 = val;
            return deferred.resolve();
          });

          return deferred.promise();
        }
      }
    );
  }
};
</script>
