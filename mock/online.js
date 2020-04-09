import Mock from 'mockjs'

export default [{
  url: '/wordDetail',
  type: 'get',
  response: config => {
    const {
      edit,
      translationLanguage
    } = config.query

    const keys = [];

    for (let i = 0; i < 300; i++) keys.push(Mock.mock('@id'));

    const wordObj = keys.reduce((total, key, index) => {
      total[key] = Mock.mock('@csentence');
      return total;
    }, {})

    const wordObj2 = keys.reduce((total, key, index) => {
      total[key] = Mock.mock('@sentence');
      return total;
    }, {})

    const transcriptObj = Object.keys(wordObj).reduce((total, key, index) => {
      total[key] = '';
      return total;
    }, {})

    const limitObj = Object.keys(wordObj).reduce((total, key, index) => {
      total[key] = index % 3 === 0 ? -1 : Mock.mock('@natural(0, 30)');
      return total;
    }, {})

    return {
      errcode: 0,
      data: {
        edit,
        translationLanguage,
        word: {
          '中文': wordObj,
          'English': wordObj2,
        },
        transcript: transcriptObj,
        limit: limitObj
      }
    }
  }
}, {
  url: '/saveWordDetail',
  type: 'post',
  response: config => {
    return {
      errcode: 0,
      data: Mock.mock('@now')
    }
  }
}, {
  url: '/exportXML',
  type: 'get',
  response: config => {
    return {
      errcode: 0,
      data: 'http://lango-tech.com/XBH/lango19/data/users.zip'
    }
  }
}, {
  url: '/exportExcel',
  type: 'get',
  response: config => {
    return {
      errcode: 0,
      data: 'http://lango-tech.com/XBH/lango19/data/users.zip'
    }
  }
}, {
  url: '/importExcel',
  type: 'post',
  response: config => {
    return {
      errcode: 0,
      data: 'success'
    }
  }
}]
