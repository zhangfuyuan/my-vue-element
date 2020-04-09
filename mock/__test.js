import Mock from 'mockjs'

const keys = [];

for (let i = 0; i < 3000; i++) keys.push(Mock.mock('@id'));

const wordObj = keys.reduce((total, key, index) => {
  total[key] = index === 0 ? '' : Mock.mock('@guid');
  return total;
}, {})

const wordObj2 = keys.reduce((total, key, index) => {
  total[key] = index === 0 ? '' : Mock.mock('@guid') + '_';
  return total;
}, {})

// const wordObj3 = keys.reduce((total, key, index) => {
//   total[key] = index === 0 ? '' : Mock.mock('@guid') + '_';
//   return total;
// }, {})

// const wordObj4 = keys.reduce((total, key, index) => {
//   total[key] = index === 0 ? '' : Mock.mock('@guid') + '_';
//   return total;
// }, {})

// const wordObj5 = keys.reduce((total, key, index) => {
//   total[key] = index === 0 ? '' : Mock.mock('@guid') + '_';
//   return total;
// }, {})

// const wordObj6 = keys.reduce((total, key, index) => {
//   total[key] = index === 0 ? '' : Mock.mock('@guid') + '_';
//   return total;
// }, {})

const transcriptObj = Object.keys(wordObj).reduce((total, key, index) => {
  total[key] = index === 0 ? '' : (index === 2 ? '已翻译的词条2' : '');
  return total;
}, {})

const limitObj = Object.keys(wordObj).reduce((total, key, index) => {
  total[key] = index === 0 ? -1 : Mock.mock('@natural(-1, 3)');
  return total;
}, {})

export default [{
  url: '/my-vue-element/__test/wordDetail',
  type: 'post',
  response: config => {
    const {
      edit,
      translationLanguage
    } = config.body

    return {
      errcode: 0,
      data: {
        edit,
        translationLanguage,
        word: {
          '词条语言1': wordObj,
          '词条语言2': wordObj2,
          // '词条语言3': wordObj3,
          // '词条语言4': wordObj4,
          // '词条语言5': wordObj5,
          // '词条语言6': wordObj6,
        },
        transcript: transcriptObj,
        limit: limitObj
      }
    }
  }
}]
