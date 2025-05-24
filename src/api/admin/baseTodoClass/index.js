import fetch from '@/plugin/axios'

export function page (query) {
  return fetch({
    url: '/api/admin/baseTodoClass/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return fetch({
    url: '/api/admin/baseTodoClass',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return fetch({
    url: '/api/admin/baseTodoClass/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return fetch({
    url: '/api/admin/baseTodoClass/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return fetch({
    url: '/api/admin/baseTodoClass/' + id,
    method: 'put',
    data: obj
  })
}
