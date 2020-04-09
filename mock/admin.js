import Mock from 'mockjs'

export default [{
  url: '/recordList',
  type: 'get',
  response: config => {
    return {
      errcode: 0,
      data: [{
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }, {
        id: Mock.mock('@id'),
        versionName: '词条版本名1',
        files: [{
          fileName: '上传的词条文件名1',
          fileLink: '词条文件名下载链接1',
          wordLanguage: '词条语言1'
        }, {
          fileName: '上传的文件名2',
          fileLink: '词条文件名下载链接2',
          wordLanguage: '词条语言2'
        }],
        translationLanguage: '翻译语言1,翻译语言2,翻译语言3',
        updatedTime: '2020-02-25 00:00:00',
        remark: '备注'
      }]
    }
  }
}, {
  url: '/createRecord',
  type: 'post',
  response: config => {
    const {
      versionName,
      translationLanguage,
      remark
    } = config.body

    return {
      errcode: 0,
      data: {
        id: Mock.mock('@id'),
        versionName,
        files: [],
        updatedTime: Mock.mock('@now'),
        translationLanguage,
        remark,
      }
    }
  }
}, {
  url: '/updatedRecord',
  type: 'post',
  response: config => {
    // const {} = config.query

    return {
      errcode: 0,
      data: Mock.mock('@now')
    }
  }
}, {
  url: '/importWord',
  type: 'post',
  response: config => {
    const {
      name,
      wordLanguage
    } = config.body;

    return {
      errcode: 0,
      data: {
        fileName: name,
        fileLink: Mock.mock('@url'),
        wordLanguage
      }
    }
  }
}, {
  url: '/createLink',
  type: 'get',
  response: config => {
    const {
      id,
      translationLanguage
    } = config.query;
    let link = `http://127.0.0.1:8126/#/online?id=${id}`;

    if (translationLanguage) link += `&translationLanguage=${translationLanguage}`;

    return {
      errcode: 0,
      data: link
    }
  }
}]
