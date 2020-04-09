import request from '@/utils/request'

export function __test() {
  return request({
    url: '/query',
    method: 'get',
    params: {
      type: '快递公司代号',
      postid: '快递单号'
    }
  })
}

export function __test2() {
  return request({
    url: '/joinSociety.json',
    method: 'post',
    data: {}
  })
}

export function getWordDetail(option) {
  return request({
    url: '/my-vue-element/__test/wordDetail',
    method: 'post',
    data: option
  })
}
