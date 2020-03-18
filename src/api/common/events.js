import request from '@/utils/httpRequest'
import API from '@/api'

export function getEventsList (params) {
  return request({
    url: API.EVENTS_LIST,
    method: 'get',
    params
  })
}

export function addEvent (data) {
  return request({
    url: API.EVENTS_LIST,
    method: 'post',
    data
  })
}

export function editEvent (id, data) {
  return request({
    url: API.EVENTS_ID + id + '/',
    method: 'put',
    data
  })
}

export function getEventsDetail (id) {
  return request({
    url: API.EVENTS_ID + id + '/',
    method: 'get',
  })
}

export function deleteEvent (id) {
  return request({
    url: API.EVENTS_ID + id + '/',
    method: 'delete'
  })
}

export function getCounts () {
  return request({
    url: API.EVENTS_COUNT,
    method: 'get'
  })
}

export function AddRelatedEvent (data) {
  return request({
    url: API.EVENTS_RELATED,
    method: 'post',
    data
  })
}

export function getActionApps () {
  return request({
    url: API.EVENT_ACTION_APPS,
    method: 'get'
  })
}

export function getActions (id) {
  return request({
    url: API.EVENT_ACTION + id + '/',
    method: 'get'
  })
}

export function runAction (id, data) {
  return request({
    url: API.EVENT_RUN_ACTION + id + '/',
    method: 'put',
    data
  })
}

export function getPlaybooknodeIO (name, artifact, id) {
  return request({
    url: API.EVENT_PLAYBOOK_IO + name + '/' + artifact + '/' + id + '/',
    method: 'get',
  })
}

export function switcherPlaybook (id, data) {
  return request({
    url: API.PLAYBOOK_RUN_PLAYBOOK + id + '/',
    method: 'put',
    data
  })
}
export function getPeriodTask (id, params) {
  return request({
    url: API.EVENT_PERIODIC_TASKS + id + '/',
    method: 'get',
    params
  })
}

export function updatePeriodTask (id, data) {
  return request({
    url: API.EVENT_PERIODIC_TASK + id + '/',
    method: 'put',
    data
  })
}

export function deletePeriodTask (id) {
  return request({
    url: API.EVENT_PERIODIC_TASK + id + '/',
    method: 'delete',
  })
}
