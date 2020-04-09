import request from '@/utils/request'

/**
一、管理后台——获取词条记录列表
提交：
searchKey  非必要  字符串  搜索关键字，模糊匹配 versionName 字段
pageNo     必要    字符串  当前页码
pageSize   必要    字符串  每页数量
beginDate  非必要  字符串  开始时间，格式"2020-03-01"
endDate    非必要  字符串  结束时间，格式"2020-04-01"
 * */
export function getRecordList(option) {
  return request({
    url: '/recordList',
    method: 'get',
    params: option
  })
}

/**
二、管理后台——添加记录
提交：
versionName          必要    字符串  版本名
translationLanguage  非必要  字符串  翻译语言，多个用","隔开
remark               非必要  字符串  备注
 * */
export function ajaxCreateRecord(option) {
  return request({
    url: '/createRecord',
    method: 'post',
    data: option
  })
}

/**
三、管理后台——导入词条
提交：
file          必要    文件流  上传xml文件流
chunks        必要    文件流  上传xml文件流分片
recordId      必要    字符串  唯一编码，分片附带
name          必要    字符串  文件名，分片附带
size          必要    数字    文件大小，分片附带
md5           必要    字符串  校验码，分片附带
wordLanguage  非必要  字符串  词条语言，分片附带
 * */
export function ajaxImportWord(option) {
  return request({
    url: '/importWord',
    method: 'post',
    data: option
  })
}

/**
四、管理后台——编辑记录
提交：
id                   必要    字符串  唯一编码
versionName          必要    字符串  版本名
translationLanguage  非必要  字符串  翻译语言，多个用","隔开
remark               非必要  字符串  备注
 * */
export function ajaxUpdatedRecord(option) {
  return request({
    url: '/updatedRecord',
    method: 'post',
    data: option
  })
}

/**
五、管理后台——生成链接
提交：
id                   必要    字符串  唯一编码
translationLanguage  非必要  字符串  翻译语言
 * */
export function ajaxCreateLink(option) {
  return request({
    url: '/createLink',
    method: 'get',
    params: option
  })
}
