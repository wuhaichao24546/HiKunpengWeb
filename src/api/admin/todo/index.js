import fetch from '@/plugin/axios'

export function page (query) {
  return fetch({
    url: '/api/admin/baseTodoList/page',
    method: 'get',
    params: query
  })
}

export function deepseek (query) {
  return fetch({
    url: '/api/admin//deepseek/question',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return fetch({
    url: '/api/admin/baseTodoList',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return fetch({
    url: '/api/admin/baseTodoList/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return fetch({
    url: '/api/admin/baseTodoList/' + id,
    method: 'delete'
  })
}

export function closeObj (id) {
  return fetch({
    url: '/api/admin/baseTodoList/close?id=' + id,
    method: 'get'
  })
}

export function pageHis (query) {
  return fetch({
    url: '/api/admin/baseTodoList/page/his',
    method: 'get',
    params: query
  })
}

export function pageClassObj () {
  return fetch({
    url: '/api/admin/baseTodoList/classList',
    method: 'get',
    params: null
  })
}

export function putObj (id, obj) {
  return fetch({
    url: '/api/admin/baseTodoList/' + id,
    method: 'put',
    data: obj
  })
}
